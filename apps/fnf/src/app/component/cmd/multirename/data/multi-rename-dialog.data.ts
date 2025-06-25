import {FileItemIf} from "@fnf/fnf-data";
import {ReplacementItem} from "./replacement.item";
import {Makro} from "./makro";
import {CapitalizeMode} from "./capitalize.mode";



export class MultiRenameDialogData {

  okEnabled: boolean = true;
  name: string = '[N].[E]';
  counterStart: string = '1';
  counterStep: string = '1';
  counterDigits: string = '4';
  replacementsChecked: boolean = false;
  replacements: ReplacementItem[] = [
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''},
    {checked: false, textFrom: '', textTo: '', regExpr: false, ifFlag: false, ifMatch: ''}
  ];

  replaceGermanUmlauts: boolean = false;
  replaceRiskyChars: boolean = false;
  replaceSpaceToUnderscore: boolean = false;
  replaceParentDir: boolean = false;
  capitalizeMode: CapitalizeMode = 'none';

  makros: Makro[] = [
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

  constructor(
    public rows: FileItemIf[] = [],
  ) {
  }
}
