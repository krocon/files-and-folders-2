import {Test, TestingModule} from '@nestjs/testing';
import {FilenameController} from './filename.controller';
import {HttpService} from '@nestjs/axios';
import {of} from 'rxjs';
import {AxiosResponse} from 'axios';

describe('FilenameController', () => {
  let controller: FilenameController;
  let httpService: HttpService;

  const input = [
    "/Users/marckronberg/Filme.nosync/Karate Kid Legends (2025)/Karate.Kid.Legends.2025.German.DL.1080p.WEB.x264-WvF/karate.kid.legends.2025.german.dl.1080p.web.x264-wvf.mkv",
    "/Users/marckronberg/Filme.nosync/The Giant Behemoth (1959)/The.Giant.Behemoth.1959.GERMAN.1080p.WEB.H264-WRO/Sample/wro-the.giant.behemoth.1959.german.1080p.web.h264-sample.mkv"
  ];

  const mockResponse: AxiosResponse = {
    data: {
      choices: [
        {
          message: {
            content: JSON.stringify({
              [input[0]]: "Karate Kid Legends (2025).mkv",
              [input[1]]: "The Giant Behemoth (1959).mkv"
            }),
          },
        },
      ],
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {headers: {'Content-Type': 'application/json'} as any},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilenameController],
      providers: [
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of(mockResponse)),
          },
        },
      ],
    }).compile();

    controller = module.get<FilenameController>(FilenameController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return renamed filenames as JSON', async () => {
    const result = await controller.convertFilenames(input);

    expect(result).toEqual({
      [input[0]]: "Karate Kid Legends (2025).mkv",
      [input[1]]: "The Giant Behemoth (1959).mkv"
    });

    expect(httpService.post).toHaveBeenCalled();
  });
});
