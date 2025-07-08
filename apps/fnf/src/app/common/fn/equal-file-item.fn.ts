import {FileItemIf} from "@fnf/fnf-data";


export const equalFileItem = (a: FileItemIf, b: FileItemIf) => a.base === b.base && a.dir === b.dir;