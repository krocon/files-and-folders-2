import {Injectable} from '@nestjs/common';
import {CleanDialogData} from '@fnf/fnf-data';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as micromatch from 'micromatch';
import {CleanResult} from "@fnf-data";

@Injectable()
export class CleanHelper {
  /**
   * Cleans files and folders based on the provided pattern
   * @param cleanDialogData The data containing folders, pattern, and deleteEmptyFolders flag
   * @returns A summary of the cleaning operation
   */
  async clean(cleanDialogData: CleanDialogData): Promise<CleanResult> {

    const result: CleanResult = {
      deletedFiles: 0,
      deletedFolders: 0,
      errors: []
    };

    // Use folders array if provided, otherwise use single folder
    const foldersToProcess = cleanDialogData.folders || [cleanDialogData.folder];

    // Process each folder
    for (const folder of foldersToProcess) {
      if (!fs.existsSync(folder)) {
        result.errors.push(`Folder does not exist: ${folder}`);
        continue;
      }

      try {
        // Delete files matching pattern
        await this.deleteMatchingFiles(folder, cleanDialogData.pattern, result);

        // Delete empty folders if requested
        if (cleanDialogData.deleteEmptyFolders) {
          await this.deleteEmptyFolders(folder, result);
        }
      } catch (error) {
        result.errors.push(`Error processing folder ${folder}: ${error.message}`);
      }
    }

    // Process each folder again:
    if (cleanDialogData.deleteEmptyFolders) {
      for (const folder of foldersToProcess) {
        await this.deleteEmptyFolders(folder, result);
      }
    }

    return result;
  }

  /**
   * Recursively deletes files and folders matching the pattern
   * @param folderPath The folder to process
   * @param pattern The glob pattern to match against
   * @param result The result object to update
   */
  private async deleteMatchingFiles(folderPath: string, pattern: string, result: CleanResult): Promise<void> {
    try {
      const entries = await fs.readdir(folderPath, {withFileTypes: true});

      for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name);

        if (entry.isDirectory()) {
          // Check if directory matches pattern
          if (micromatch.isMatch(fullPath, pattern)) {
            try {
              await fs.remove(fullPath);
              result.deletedFolders++;
            } catch (error) {
              result.errors.push(`Failed to delete folder ${fullPath}: ${error.message}`);
            }
          } else {
            // Recursively process subdirectories only if they don't match the pattern
            await this.deleteMatchingFiles(fullPath, pattern, result);
          }
        } else {
          // Check if file matches pattern
          if (micromatch.isMatch(fullPath, pattern)) {
            try {
              await fs.remove(fullPath);
              result.deletedFiles++;
            } catch (error) {
              result.errors.push(`Failed to delete file ${fullPath}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      result.errors.push(`Error reading directory ${folderPath}: ${error.message}`);
    }
  }

  /**
   * Recursively deletes empty folders
   * @param folderPath The folder to process
   * @param result The result object to update
   * @returns True if the folder is empty (or was emptied), false otherwise
   */
  private async deleteEmptyFolders(folderPath: string, result: CleanResult): Promise<boolean> {
    try {
      const entries = await fs.readdir(folderPath);

      // Process all subdirectories first
      for (const entry of entries) {
        const fullPath = path.join(folderPath, entry);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {


          // If subdirectory was empty and deleted, don't include it in our check
          const wasEmpty = await this.deleteEmptyFolders(fullPath, result);

          if (wasEmpty) {
            // Remove the entry from our list since it's been deleted
            const index = entries.indexOf(entry);
            if (index > -1) {
              entries.splice(index, 1);
            }
          }
        }
      }

      // If directory is empty after processing subdirectories, delete it
      if (entries.length === 0) {
        try {
          await fs.rmdir(folderPath);
          result.deletedFolders++;
          return true;
        } catch (error) {
          result.errors.push(`Failed to delete empty folder ${folderPath}: ${error.message}`);
        }
      }

      return false;
    } catch (error) {
      result.errors.push(`Error checking if folder is empty ${folderPath}: ${error.message}`);
      return false;
    }
  }
}
