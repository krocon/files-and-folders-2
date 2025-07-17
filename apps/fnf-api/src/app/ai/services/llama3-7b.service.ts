import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ConvertPara, ConvertResponseType} from '@fnf-data';

@Injectable()
export class Llama3_7bService {
  // Get API endpoint and model from environment variables
  private readonly apiUrl = environment.llamaApiUrl;
  private readonly model = environment.llamaModel;

  constructor(private readonly httpService: HttpService) {
  }

  async hasApiKey(): Promise<boolean> {
    // Check if Llama API key is available
    console.log('Llama API key:', environment.llamaApiKey);
    return !!environment.llamaApiKey;
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

    return this.processLlamaRequest(para.files, prompt);
  }

  async groupfiles(para: ConvertPara): Promise<ConvertResponseType> {
    const prompt = `I have a list of filenames (television series). 
Please create a new filename for each file.

Try to use this pattern:
new name (path):  "/{TITLE}/{Snn}/{Snn}{Enn} - {EPISODE}.{EXT}"
If you don't have the episode title, use this pattern: new name (path):  "/{TITLE}/{Snn}/{Snn}{Enn} - {TITLE}.{EXT}"

Placeholder:
{EPISODE}: title of episode (if not available use {TITLE} placeholder)
{TITLE}: title of television series
{Snn}: Series Number uppercase (for example S01)
{Enn}: Episode Number uppercase (for example E01)
{EXT}: file extension

Example:
 -Input:  ["/Users/Abc/movies/Jim Knopf/Jim.Knopf.S03E03.GERMAN.1080p.WEB.H264-SunDry/jim.knopf.s03e02.1080p.web.h264-sundry.mkv"]
 -Output: {"/Users/Abc/movies/Jim Knopf/Jim.Knopf.S03E03.GERMAN.1080p.WEB.H264-SunDry/jim.knopf.s03e02.1080p.web.h264-sundry.mkv": "/Jim Knopf/S03/S03E02 - Jim Knopf.mkv"}

Rule:
Make sure that the last part of the filename (behind last '/') containes {Snn} and {Enn} placeholders. 
Do not write "TheEpisodeTitle" or "EpisodeNotAvailable". 
Do not change the name of sample files. 
Sample files are in a (sub) folder "/Sample/" or they have ".sample." in the name. 
Do not include sample files in the output.
Output must be parsable JSON.

Your answer should be a valid (parsable) JSON in the form: {[key:string]: string} (key is the input file, value is the new name).
Just return the parsable JSON in the field "response", no explanations.
Input:

`;

    return this.processLlamaRequest(para.files, prompt);
  }

  /**
   * Process a request to Llama 3 7B API with the given files and prompt
   * @param files Array of filenames to process
   * @param promptTemplate The prompt template to use for the request
   * @returns Converted response from Llama
   * @throws Error if Llama API key is missing or authentication fails
   */
  private async processLlamaRequest(files: string[], promptTemplate: string): Promise<ConvertResponseType> {
    this.validateApiKey();

    const fileList = files.join('\n');
    const prompt = promptTemplate + fileList;

    const headers = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${environment.llamaApiKey}`,
    };

    // This body structure might need to be adjusted based on the actual Llama API requirements
    const body = {
      model: this.model,
      prompt,
      stream: false
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, body, {headers}),
      );

      try {
        // This parsing logic might need to be adjusted based on the actual Llama API response format
        const s = response.data.response;

        return JSON.parse(s.replace(/Here is the JSON output:/g, '').trim());

      } catch (e) {
        console.log('Llama response:', response.data.response);
        console.error('Error parsing Llama response:', e);
        return {'error': e + ''};
      }
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Validate that the Llama API key is present
   * @throws Error if the API key is missing
   */
  private validateApiKey(): void {
    if (!environment.llamaApiKey) {
      throw new Error('Llama API key is missing. Please set the FNF_LLAMA_API_KEY environment variable.');
    }
  }

  /**
   * Handle errors from the Llama API
   * @param error The error object from the API call
   * @throws Error with appropriate message based on the error type
   */
  private handleApiError(error: any): never {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error with Llama API:', error);
      throw new Error('Authentication failed with Llama API. Please check your API key.');
    }
    console.error('Error calling Llama API:', error);
    throw error;
  }
}
