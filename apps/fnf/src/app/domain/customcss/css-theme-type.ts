export const cssThemes = [
  "light", "bitbucket", "blackboard", "coffee", "combat", "cypress", "paper", "norton"
] as const;

export type Theme = typeof cssThemes[number];
