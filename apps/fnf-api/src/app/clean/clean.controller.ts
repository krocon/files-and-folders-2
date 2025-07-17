import {Body, Controller, Post} from '@nestjs/common';
import {CleanDialogData} from '@fnf/fnf-data';
import {CleanHelper} from './clean.helper';
import {CleanResult} from "@fnf-data";

@Controller()
export class CleanController {

  constructor(private readonly cleanHelper: CleanHelper) {
  }

  /**
   * Cleans files and folders based on the provided pattern
   * @param cleanDialogData The data containing folders, pattern, and deleteEmptyFolders flag
   * @returns A summary of the cleaning operation
   */
  @Post('clean')
  async clean(
    @Body() cleanDialogData: CleanDialogData
  ): Promise<CleanResult> {
    return this.cleanHelper.clean(cleanDialogData);
  }
}