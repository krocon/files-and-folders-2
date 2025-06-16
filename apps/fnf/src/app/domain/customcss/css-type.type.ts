export const cssTypes = [
  "foreground", "background", "border", "size", "material"
] as const;
export type CssType = typeof cssTypes[number];

