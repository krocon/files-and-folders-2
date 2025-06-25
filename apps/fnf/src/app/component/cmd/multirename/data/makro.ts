import {MakroData} from "./makro.data";

export interface Makro {
  cat: string;
  title: string;
  example: string;
  data: MakroData;
}