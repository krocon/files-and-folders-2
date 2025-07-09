import {Controller, Post} from '@nestjs/common';
import {firstValueFrom} from 'rxjs';
import {HttpService} from "@nestjs/axios";
import {environment} from "../../environments/environment";
import {ConvertPara, ConvertResponseType} from "@fnf-data/src";
import {MessageBody} from "@nestjs/websockets";


@Controller()
export class FilenameController {

  constructor(private readonly httpService: HttpService) {
  }

  @Post("convertnames")
  async convertFilenames(
    @MessageBody() para: ConvertPara
  ): Promise<ConvertResponseType> {

    const files: string[] = para.files;
    const fs = files.join('\n');

    if (!environment.openaiApiKey) {
      throw new Error('OpenAI API key is missing. Please set the FNF_OPENAI_API_KEY environment variable.');
    }

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const prompt = `I have a list of filenames. 
Please create a new filename for each file.
The files are well-known movies, books, music, ...

Try to use these pattern:
Movie: TITLE (yyyy).ext
Music: ARTIST - TITLE. ext or Album ARTIST - ALBUM (yyyy) /TRACK - TITLE.ext
Book: AUTHOR - TITLE (yyyy).ext
TV Show: SHOWNAME - SxxEyy - TITLE.ext
Podcast: PODCASTNAME - Ep### - TITLE.ext
Audiobook: AUTHOR - TITLE (yyyy).ext
Game: ROM TITLE [REGION] (yyyy).ext
Comics: TITLE ## (PUBLISHER) (YEAR).ext

Your answer should be a valid (parsable) JSON in the form: {[key:string]: string}.
(key is the input file, value is the new filename (BASE.EXT, without path).

Input:

` + fs;

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

      try {
        const reply = response.data.choices?.[0]?.message?.content;
        return JSON.parse(reply.replace(/Output:/g, '').trim());

      } catch (e) {
        console.error(e);
        return {'error': e + ''};
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(error);
        throw new Error('Authentication failed with OpenAI API. Please check your API key.');
      }
      throw error;
    }
  }
}
