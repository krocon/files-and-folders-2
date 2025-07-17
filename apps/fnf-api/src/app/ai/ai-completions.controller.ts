import {Controller, Post} from '@nestjs/common';
import {environment} from "../../environments/environment";
import {ConvertPara, ConvertResponseType} from "@fnf-data";
import {MessageBody} from "@nestjs/websockets";
import {OpenAiCompletionService} from "./services/open-ai-completion.service";
import {Llama3_7bService} from "./services/llama3-7b.service";

@Controller('ai')
export class AiCompletionsController {
  constructor(
    private readonly openAiService: OpenAiCompletionService,
    private readonly llamaService: Llama3_7bService
  ) {
  }

  /**
   * Get the appropriate AI service based on the environment configuration
   * @returns The selected AI service
   */
  private getAiService() {
    return environment.aiCompletionService === 'llama' ? this.llamaService : this.openAiService;
  }

  @Post("hasopenaiapikey")
  async hasOpenAiApiKey(): Promise<boolean> {
    return await this.getAiService().hasApiKey();
  }

  @Post("convertnames")
  async convertFilenames(
    @MessageBody() para: ConvertPara
  ): Promise<ConvertResponseType> {
    return this.getAiService().convertFilenames(para);
  }


  @Post("groupfiles")
  async groupfiles(
    @MessageBody() para: ConvertPara
  ): Promise<ConvertResponseType> {
    return this.getAiService().groupfiles(para);
  }

}
