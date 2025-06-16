import {Injectable} from "@nestjs/common";
import {Config} from "@fnf/fnf-data";


/**
 * @class ConfigService
 * @description A service responsible for managing and accessing application configuration settings.
 * This service provides access to container paths, incompatible paths, and other configuration data
 * through a singleton pattern using a static config instance.
 *
 * The service is injectable and can be used across the application to maintain consistent
 * configuration access.
 *
 * @example
 * ```typescript
 * @Injectable()
 * class SomeService {
 *   constructor(private readonly configService: ConfigService) {}
 *
 *   someMethod() {
 *     const config = this.configService.getData();
 *     const containerPaths = this.configService.getRestrictedContainerPaths();
 *   }
 * }
 * ```
 */
@Injectable()
export class ConfigService {
  /**
   * Static configuration instance that holds the application's configuration data.
   * This ensures a single source of truth for configuration across the application.
   */
  static config: Config = new Config();

  /**
   * Retrieves the complete configuration object.
   *
   * @returns {Config} The complete configuration object containing all configuration settings
   */
  getData(): Config {
    return ConfigService.config;
  }

  /**
   * Checks if there are any restricted container paths defined in the configuration.
   *
   * @returns {boolean} True if there are restricted container paths defined, false otherwise
   */
  hasRestrictedContainerPaths(): boolean {
    return !!ConfigService.config.containerPaths.length;
  }

  /**
   * Retrieves the list of restricted container paths from the configuration.
   *
   * @returns {string[]} An array of restricted container paths
   */
  getRestrictedContainerPaths(): string[] {
    return ConfigService.config.containerPaths;
  }

  /**
   * Checks if there are any incompatible paths defined in the configuration.
   *
   * @returns {boolean} True if there are incompatible paths defined, false otherwise
   */
  hasIncompatiblePaths(): boolean {
    return !!ConfigService.config.incompatiblePaths.length;
  }

  /**
   * Retrieves the list of incompatible paths from the configuration.
   *
   * @returns {string[]} An array of incompatible paths
   */
  getIncompatiblePaths(): string[] {
    return ConfigService.config.incompatiblePaths;
  }
}