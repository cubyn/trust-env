module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // globalSetup: './tests/setup.ts',
  // setupFilesAfterEnv: ['./tests/setup-after-env.ts'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      branches: 33,
      functions: 33,
      lines: 33,
      statements: 33,
    },
  },
};
