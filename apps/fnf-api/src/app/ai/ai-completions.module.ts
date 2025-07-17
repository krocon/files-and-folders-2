import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {AiCompletionsController} from './ai-completions.controller';

@Module({
  imports: [HttpModule],
  controllers: [AiCompletionsController],
})
export class AiCompletionsModule {
}
