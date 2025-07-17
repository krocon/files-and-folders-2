import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ConvertPara, ConvertResponseType} from "@fnf/fnf-data";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {QueueFileOperationParams} from "../../domain/cmd/queue-file-operation-params";


@Injectable({
  providedIn: "root"
})
export class AiCompletionService {

  private static readonly config = {
    convertnamesUrl: "/api/ai/convertnames",
    groupfilesUrl: "/api/ai/groupfiles",
    hasOpenAiApiKeyUrl: "/api/ai/hasopenaiapikey"
  };

  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  static forRoot(config: { [key: string]: string | boolean }) {
    Object.assign(AiCompletionService.config, config);
  }


  hasOpenAiApiKey(): Observable<boolean> {
    return this.httpClient
      .post<boolean | string>(AiCompletionService.config.hasOpenAiApiKeyUrl, null)
      .pipe(
        map(r => r === 'true' || r === true)
      );
  }

  convertnames(para: ConvertPara): Observable<ConvertResponseType> {
    return this.httpClient
      .post<ConvertResponseType>(
        AiCompletionService.config.convertnamesUrl,
        para
      );
  }

  groupfiles(para: ConvertPara): Observable<ConvertResponseType> {
    // TODO
    return of({
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E03.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s03e03.1080p.web.h264-sundry.mkv": "/Jack Taylor/S03/S03E03 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E02.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s03e02.1080p.web.h264-sundry.mkv": "/Jack Taylor/S03/S03E02 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E01.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s03e01.1080p.web.h264-sundry.mkv": "/Jack Taylor/S03/S03E01 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E03.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s02e03.1080p.web.h264-sundry.mkv": "/Jack Taylor/S02/S02E03 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E02.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s02e02.1080p.web.h264-sundry.mkv": "/Jack Taylor/S02/S02E02 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E01.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s02e01.1080p.web.h264-sundry.mkv": "/Jack Taylor/S02/S02E01 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E03.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s01e03.1080p.web.h264-sundry.mkv": "/Jack Taylor/S01/S01E03 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E02.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s01e02.1080p.web.h264-sundry.mkv": "/Jack Taylor/S01/S01E02 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E01.GERMAN.1080p.WEB.H264-SunDry/jack.taylor.s01e01.1080p.web.h264-sundry.mkv": "/Jack Taylor/S01/S01E01 - Jack Taylor.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e03.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e03.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e02.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e02.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e01.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S03E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s03e01.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e03.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e03.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e02.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e02.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e01.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S02E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s02e01.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e03.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E03.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e03.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e02.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E02.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e02.1080p.web.h264-sundry.sample.mkv",
      "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e01.1080p.web.h264-sundry.sample.mkv": "/Users/marckronberg/Filme.nosync/Jack Taylor/Jack.Taylor.S01E01.GERMAN.1080p.WEB.H264-SunDry/Sample/jack.taylor.s01e01.1080p.web.h264-sundry.sample.mkv"
    });
    // return this.httpClient
    //   .post<ConvertResponseType>(
    //     AiCompletionService.config.groupfilesUrl,
    //     para
    //   );
  }

  fileOperationParams2Url(r: QueueFileOperationParams): string {
    return r.source.dir + '/' + r.source.base;
  }

  // fileItemEquals(a: FileItemIf, b: FileItemIf): boolean {
  //   return a.dir === b.dir
  //   && a.base ===b.base;
  // }

}