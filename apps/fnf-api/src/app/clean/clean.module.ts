import {Module} from '@nestjs/common';
import {CleanController} from './clean.controller';
import {CleanHelper} from './clean.helper';

@Module({
  controllers: [
    CleanController
  ],
  providers: [
    CleanHelper
  ]
})
export class CleanModule {
}