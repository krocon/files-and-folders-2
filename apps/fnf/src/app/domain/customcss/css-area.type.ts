export const cssAreas = [
  "base", "header", "table", "footer", "dialog", "menu", "tooltip", "scrollbar"
] as const;
export type CssArea = typeof cssAreas[number];

