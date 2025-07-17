import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ConvertPara, ConvertResponseType} from '@fnf-data';

@Injectable()
export class OpenAiCompletionService {
  constructor(private readonly httpService: HttpService) {
  }

  async hasApiKey(): Promise<boolean> {
    return !!environment.openaiApiKey;
  }

  async convertFilenames(para: ConvertPara): Promise<ConvertResponseType> {
    const prompt = `I have a list of filenames. 
Please create a new filename for each file.
The files are well-known movies, books, music, ...

Try to use these patterns:
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

`;

    return this.processOpenAiRequest(para.files, prompt);
  }

  async groupfiles(para: ConvertPara): Promise<ConvertResponseType> {
    const prompt = `I have a list of filenames (television series). 
Please create a new filename for each file.

Try to use this pattern:
new name (path):  "/TITLE/Snn/SnnEnn - EPISODE.EXT"
TITLE: title of television series
Snn: Series Number (for example S01)
Enn: Episode Number (for example E01)
EPISODE: title of episode (if not available use TITLE)
EXT: file extension

Do not change the name of sample files. Sample files are in a (sub) folder "/Sample/" or they have "*.sample.*" in the name.

Your answer should be a valid (parsable) JSON in the form: {[key:string]: string} (key is the input file, value is the new name).

Input:

`;

    return this.processOpenAiRequest(para.files, prompt);
  }

  /**
   * Process a request to OpenAI API with the given files and prompt
   * @param files Array of filenames to process
   * @param promptTemplate The prompt template to use for the request
   * @returns Converted response from OpenAI
   * @throws Error if OpenAI API key is missing or authentication fails
   */
  private async processOpenAiRequest(files: string[], promptTemplate: string): Promise<ConvertResponseType> {
    this.validateApiKey();

    const fileList = files.join('\n');
    const prompt = promptTemplate + fileList;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.openaiApiKey}`,
    };

    const body = {
      model: environment.openaiModel,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(environment.openaiApiUrl, body, {headers}),
      );

      try {
        const reply = response.data.choices?.[0]?.message?.content;
        return JSON.parse(reply.replace(/Output:/g, '').trim());
      } catch (e) {
        console.error('Error parsing OpenAI response:', e);
        return {'error': e + ''};
      }
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Validate that the OpenAI API key is present
   * @throws Error if the API key is missing
   */
  private validateApiKey(): void {
    if (!environment.openaiApiKey) {
      throw new Error('OpenAI API key is missing. Please set the FNF_OPENAI_API_KEY environment variable.');
    }
  }

  /**
   * Handle errors from the OpenAI API
   * @param error The error object from the API call
   * @throws Error with appropriate message based on the error type
   */
  private handleApiError(error: any): never {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error with OpenAI API:', error);
      throw new Error('Authentication failed with OpenAI API. Please check your API key.');
    }
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
