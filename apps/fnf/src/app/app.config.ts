import {ApplicationConfig, ApplicationRef, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {Socket, SOCKET_CONFIG_TOKEN, SocketIoConfig} from 'ngx-socket-io';

import {routes} from './app.routes';
import {environment} from '../environments/environment';

// Import services for configuration
import {ConfigService} from './service/config.service';
import {SysinfoService} from './service/sysinfo.service';
import {LookAndFeelService} from './service/look-and-feel.service';
import {ShortcutService} from './service/shortcut.service';
import {FileSystemService} from './service/file-system.service';
import {FileActionService} from './service/cmd/file-action.service';
import {GotoAnythingDialogService} from './component/cmd/gotoanything/goto-anything-dialog.service';
import {ToolService} from './service/tool.service';
import {FiletypeExtensionsService} from './service/filetype-extensions.service';
import {AiCompletionService} from './service/ai/ai-completion.service';
import {GlobValidatorService} from './service/glob-validator.service';
import {CleanService} from './service/clean.service';
import {ShellService} from './service/shell.service';
import {ShellAutocompleteService} from './service/shell-autocomplete.service';
import {ServershellService} from './component/shell/service/servershell.service';
import {ServershellAutocompleteService} from './component/shell/service/servershell-autocomplete.service';
import {EditService} from './service/edit.service';
import {WalkdirService} from './common/walkdir/walkdir.service';
import {WalkdirSyncService} from './common/walkdir/walkdir-sync.service';
import {WalkSocketService} from './common/walkdir/walk.socketio.service';

function initServices() {
  // Set config to services immediately when this file is loaded:
  ConfigService.forRoot(environment.config);
  SysinfoService.forRoot(environment.sysinfo);
  LookAndFeelService.forRoot(environment.lookAndFeel);
  ShortcutService.forRoot(environment.shortcut);
  FileSystemService.forRoot(environment.fileSystem);
  FileActionService.forRoot(environment.fileAction);
  GotoAnythingDialogService.forRoot(environment.gotoAnything);
  ToolService.forRoot(environment.tool);
  FiletypeExtensionsService.forRoot(environment.filetypeExtensions);
  AiCompletionService.forRoot(environment.multiRename);
  GlobValidatorService.forRoot(environment.checkGlob);
  CleanService.forRoot(environment.clean);
  ShellService.forRoot(environment.shell);
  ShellAutocompleteService.forRoot(environment.shellAutocomplete);
  ServershellService.forRoot(environment.shell);
  ServershellAutocompleteService.forRoot(environment.shellAutocomplete);
  EditService.forRoot(environment.edit);

  WalkdirService.forRoot(environment.walkdir);
  WalkdirSyncService.forRoot(environment.walkdir);
  WalkSocketService.forRoot(environment.walkdir);


  console.info('Files and Folders');
  console.info('        > App services initialized');
}

initServices();

const config: SocketIoConfig = {
  url: "http://localhost:3334",
  options: {
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  }
};


// Factory function to create a Socket instance with the config and ApplicationRef
export function socketFactory(config: SocketIoConfig, appRef: ApplicationRef): Socket {
  return new Socket(config, appRef);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes/*, withDebugTracing()*/),
    provideAnimations(),
    provideHttpClient(),
    {provide: SOCKET_CONFIG_TOKEN, useValue: config},
    {provide: Socket, useFactory: socketFactory, deps: [SOCKET_CONFIG_TOKEN, ApplicationRef]},
  ]
};
