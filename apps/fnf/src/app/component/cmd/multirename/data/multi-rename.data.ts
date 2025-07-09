import {ReplacementItem} from "./replacement.item";
import {Makro} from "./makro";
import {CapitalizeMode} from "./capitalize.mode";


export class MultiRenameData {


  strategy: 'Manual' | 'AI' = 'Manual';
  renameTemplate: string = '[N].[E]';
  counterStart: number = 1;
  counterStep: number = 1;
  counterDigits: number = 4;

  replacementsChecked: boolean = false;
  replacements: ReplacementItem[] = [
    {checked: false, textFrom: '/[\\._\\-]/g', textTo: ' ', regExpr: true, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''}
  ];

  ignoreExtension: boolean = true;
  replaceGermanUmlauts: boolean = false;
  replaceRiskyChars: boolean = false;
  replaceSpaceToUnderscore: boolean = false;
  replaceParentDir: boolean = false;
  capitalizeMode: CapitalizeMode = 'none';

  makros: Makro[] = [
    {
      cat: 'Replace chars',
      title: 'Replace pseudo delimiter: ._- -> space',
      example: '"Das-Joshua-Profil.epub" -> "Das Joshua Profil.epub"',
      data: {
        textFrom: '/[\\._\\-]/g',
        regExpr: true,
        textTo: ' ',
        ifFlag: false,
        ifMatch: ''
      }
    },
    {
      cat: 'Extract words',
      title: 'Movies with yyyy',
      example: '"white.snow.1959.german.1080p.web.h264.mkv" -> "white snow (1959).mkv"',
      data: {
        textFrom: '/([\\D]*)[ \\[.\\-\\(](\\d{4}).*/g',
        regExpr: true,
        textTo: '$1 ($2)',
        ifFlag: true,
        ifMatch: '/\\d\\d\\d\\d/'
      }
    },
    {
      cat: 'Reorder words',
      title: 'prename name - title -> name, prename - title',
      example: '"Sebastian Fitzek - Das Joshua-Profil.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
      data: {
        textFrom: '/([^.\\s\\-]+)\\s([^.\\s\-]+)\\s\\-\\s(.+)/g',
        regExpr: true,
        textTo: '$2, $1 - $3',
        ifFlag: true,
        ifMatch: '/([^,]) - ([^,]+)/'
      }
    },
    {
      cat: 'Reorder words',
      title: 'title - prename name -> name, prename - title',
      example: '"Das Joshua-Profil - Sebastian Fitzek.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
      data: {
        textFrom: '/(.+)\\s\\-\\s([^.\\s]+)\\s([^.]+)\\.([^.]+)/g',
        regExpr: true,
        textTo: '$3, $2 - $1.$4',
        ifFlag: true,
        ifMatch: '/([^,]) - ([^,]+)/'
      }
    },
    {
      cat: 'Reorder words',
      title: 'title - lastname, prename.suffix ->  lastname, prename - title.suffix',
      example: '"Das Joshua-Profil - Fitzek, Sebastian.epub" -> "Fitzek, Sebastian - Das Joshua-Profil.epub"',
      data: {
        textFrom: '/(.+)\\s\\-\\s([^.\\s]+)[\\s,]([^.]+)\\.([^.]+)/g',
        regExpr: true,
        textTo: '$2, $3 - $1.$4',
        ifFlag: true,
        ifMatch: '/([^,]) - ([^.\\s]+)[\\s,]([^.]+)/'
      }
    }
  ];

}
