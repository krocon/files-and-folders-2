import {Body, Controller, Post} from '@nestjs/common';
import {firstValueFrom} from 'rxjs';
import {HttpService} from "@nestjs/axios";
import {environment} from "../../environments/environment";


@Controller('convert')
export class FilenameController {

  constructor(private readonly httpService: HttpService) {
  }

  @Post()
  async convertFilenames(@Body('files') files: string[]) {
    if (!environment.openaiApiKey) {
      throw new Error('OpenAI API key is missing. Please set the FNF_OPENAI_API_KEY environment variable.');
    }

    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Beispiel: OpenAI Chat API

    const prompt = `Ich habe eine Liste von Filenamen. Bitte erstelle mir für jedes File einen Dateinamen in der Form "TITLE (yyyy).EXT". Die Files sind Video-Dateien von bekannten Filmen. Die Ausgabe sollte JSON sein.\nInput : ${JSON.stringify(files)}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`,
    };

    const body = {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(apiUrl, body, {headers}),
      );

      const reply = response.data.choices?.[0]?.message?.content;
      return JSON.parse(reply);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(error);
        throw new Error('Authentication failed with OpenAI API. Please check your API key.');
      }
      throw error;
    }
  }
}
