import {CustomCcsKeyType} from "./custom-ccs-key.type";
import {CssArea} from "./css-area.type";
import {CssType} from "./css-type.type";


export class CustomCssItem {
  constructor(
    public area: CssArea = "header",
    public type: CssType = "foreground",
    public cssKey: CustomCcsKeyType = "--fnf-material-primary-color",
    public cssColor: string = "",
    public selected = false
  ) {
  }
}
