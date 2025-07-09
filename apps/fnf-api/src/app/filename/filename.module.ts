import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {FilenameController} from './filename.controller';

@Module({
  imports: [HttpModule],
  controllers: [FilenameController],
})
export class FilenameModule {
}
