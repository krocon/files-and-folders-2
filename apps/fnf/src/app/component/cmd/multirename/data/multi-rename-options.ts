import {Options} from "./options";
import {OptionItem} from "./option.item";


export class MultiRenameOptions implements Options {


  digits: OptionItem<number>[] = [
    {value: 1, label: '1'},
    {value: 2, label: '02'},
    {value: 3, label: '003'},
    {value: 4, label: '0004'},
    {value: 5, label: '00005'},
    {value: 6, label: '000006'},
    {value: 7, label: '0000007'},
    {value: 8, label: '00000008'},
    {value: 9, label: '000000009'},
    {value: 10, label: '0000000010'}
  ];

  starts: OptionItem<number>[] = [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 10, label: '10'},
    {value: 100, label: '100'},
    {value: 1000, label: '1.000'},
    {value: 10000, label: '10.000'},
    {value: 100000, label: '100.000'},
    {value: 1000000, label: '1000.000'}
  ];

  steps: OptionItem<number>[] = [
    {value: 1, label: '1'},
    {value: 5, label: '5'},
    {value: 10, label: '10'},
    {value: 20, label: '20'},
    {value: 30, label: '50'},
    {value: 100, label: '100'},
    {value: 1000, label: '1.000'}
  ];

  capitalizeModes: OptionItem<string>[] = [
    {value: 'none', label: 'none'},
    {value: 'uppercase', label: 'to uppercase'},
    {value: 'lowercase', label: 'to lowercase'},
    {value: 'capitalize_first_letter', label: 'capitalize first letter'},
    {value: 'capitalize_words', label: 'capitalize words'},
    {value: 'chicago_manual_of_style', label: 'chicago manual of style'}
  ];


}
