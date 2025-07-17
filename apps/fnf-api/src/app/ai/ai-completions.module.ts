import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import {AiCompletionsController} from './ai-completions.controller';
import {OpenAiCompletionService} from './services/open-ai-completion.service';
import {Llama3_7bService} from './services/llama3-7b.service';

@Module({
  imports: [HttpModule],
  controllers: [AiCompletionsController],
  providers: [OpenAiCompletionService, Llama3_7bService],
})
export class AiCompletionsModule {
}
