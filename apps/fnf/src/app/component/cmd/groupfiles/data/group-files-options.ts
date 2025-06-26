import {OptionItem} from "./option.item";


export class GroupFilesOptions {

  minSizes: OptionItem<number>[] = [
    {value: 0, label: 'none'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
    {value: 10, label: '10'}
  ];

  modes: OptionItem<string>[] = [
    {value: 'runnig_number', label: 'Running number'},
    {value: 'new_folder', label: 'New folder (manually)'},
    {value: 'minus_separator', label: 'Minus separator'},
    {value: 'first_word', label: 'First word'},
    {value: 'first_letter', label: 'First letter'},
    {value: 'first_letter_lower', label: 'First letter lowercase'},
    {value: 'first_letter_upper', label: 'First letter uppercase'},
    {value: 'two_letters', label: 'Two letters'},
    {value: 'two_letters_lower', label: 'Two letters lowercase'},
    {value: 'two_letters_upper', label: 'Two letters uppercase'}
  ];


}
