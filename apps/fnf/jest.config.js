module.exports = {
  preset: "jest-preset-angular/presets/defaults",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  transform: {
    "^.+\\.(ts|js|html)$": ["jest-preset-angular", {
      tsconfig: "<rootDir>/tsconfig.spec.json"
    }]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!.*\\.mjs$)"
  ],
  moduleFileExtensions: ["ts", "js", "html", "json"],
  moduleNameMapper: {
    "^@fnf-data$": "<rootDir>/../../libs/fnf-data/src/index.ts",
    "^@fnf-data/(.*)$": "<rootDir>/../../libs/fnf-data/$1",
    "^@fnf/fnf-data$": "<rootDir>/../../libs/fnf-data/src/index.ts"
  },
  modulePaths: ["<rootDir>/../../"],
  moduleDirectories: ["node_modules", "<rootDir>/../../libs"],

  extensionsToTreatAsEsm: [".ts"],
};
