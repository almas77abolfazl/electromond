module.exports = {
  roots: ["./src", "./test"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.{ts,js}"],
};
