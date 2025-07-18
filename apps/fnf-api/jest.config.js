module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!.*\\.mjs$)"
  ],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@fnf-data$": "<rootDir>/../../../libs/fnf-data/src/index.ts",
    "^@fnf-data/(.*)$": "<rootDir>/../../../libs/fnf-data/$1",
    "^@fnf/fnf-data$": "<rootDir>/../../../libs/fnf-data/src/index.ts",
    "^@fnf/fnf-api/(.*)$": "<rootDir>/$1",
    "^ngx-socket-io$": "<rootDir>/../__mocks__/ngx-socket-io.ts"
  },
  modulePaths: ["<rootDir>/../../../"],
  moduleDirectories: ["node_modules", "<rootDir>/../../../libs"]
};