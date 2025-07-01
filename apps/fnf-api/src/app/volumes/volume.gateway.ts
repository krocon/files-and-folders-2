import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import * as path from "path";
import * as fs from "fs-extra";
import {environment} from "../../environments/environment";
import {FSWatcher} from "chokidar";
import * as os from 'os';

@WebSocketGateway(environment.websocketPort, environment.websocketOptions)
export class VolumeGateway {

  private static readonly VOLUMES = VolumeGateway.getVolumesPath();
  private static readonly ADDITIONAL_LINUX_PATHS = ['/media', '/mnt'];

  @WebSocketServer() server: Server;
  private fsWatcher: FSWatcher;

  constructor() {
    this.setupWatcher();
  }

  private static getVolumesPath(): string {
    switch (os.platform()) {
      case 'darwin':
        return '/Volumes';
      case 'linux':
        // Check both possible mount points
        return `/media/${os.userInfo().username}`;
      default:
        return null;
    }
  }

  @SubscribeMessage("getvolumes")
  volumes(): void {
    this.server.emit("volumes", this.getVolumes());
  }

  getVolumes(): string[] {
    switch (os.platform()) {
      case 'darwin':
        return this.getMacVolumes();
      case 'linux':
        return this.getLinuxVolumes();
      case 'win32':
        return this.getWindowsDrives();
      default:
        return [];
    }
  }

  private setupWatcher() {
    this.fsWatcher = new FSWatcher({
      ignoreInitial: true,
      depth: 0,
      atomic: true
    });
    this.fsWatcher.on('error', (error) => console.error('FSWatcher error:', error));

    if (os.platform() === 'win32') {
      // Windows needs polling as there's no single directory to watch
      setInterval(() => this.volumes(), 5000);
    } else {
      // For Linux and macOS, we can watch directories
      const pathsToWatch = [VolumeGateway.VOLUMES];

      // Add additional Linux paths if on Linux
      if (os.platform() === 'linux') {
        pathsToWatch.push(...VolumeGateway.ADDITIONAL_LINUX_PATHS);
      }

      // Filter out null values and watch existing directories
      pathsToWatch
        .filter(p => p && fs.existsSync(p))
        .forEach(p => {
          this.fsWatcher.add(p).on("all", (event, f) => {
            this.volumes();
          });
        });
    }
  }

  private getMacVolumes(): string[] {
    return fs
      .readdirSync(VolumeGateway.VOLUMES, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(VolumeGateway.VOLUMES, dirent.name));
  }

  private getLinuxVolumes(): string[] {
    const volumes: Set<string> = new Set();

    // Check all possible mount locations
    const checkPaths = [
      VolumeGateway.VOLUMES,
      ...VolumeGateway.ADDITIONAL_LINUX_PATHS
    ];

    for (const basePath of checkPaths) {
      try {
        if (fs.existsSync(basePath)) {
          const entries = fs.readdirSync(basePath, {withFileTypes: true});
          entries
            .filter(dirent => dirent.isDirectory())
            .forEach(dirent => {
              volumes.add(path.join(basePath, dirent.name));
            });
        }
      } catch (error) {
        console.error(`Error reading ${basePath}:`, error);
      }
    }

    return Array.from(volumes);
  }

  private getWindowsDrives(): string[] {
    const drives: string[] = [];
    for (let i = 65; i <= 90; i++) {
      const drivePath = `${String.fromCharCode(i)}:\\`;
      try {
        fs.accessSync(drivePath);
        drives.push(drivePath);
      } catch (e) {
        // ignore
      }
    }
    return drives;
  }
}