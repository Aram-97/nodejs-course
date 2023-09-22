module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src/"],
  silent: false,
  verbose: true,
  setupFilesAfterEnv: ["jest-extended/all"],
  collectCoverageFrom: ["src/home-task-4/**"],
  coverageReporters: ["text"],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
