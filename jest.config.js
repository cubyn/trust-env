module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  reporters: ['default'],
  coverageThreshold: {
    global: {
      branches: 33,
      functions: 33,
      lines: 33,
      statements: 33,
    },
  },
};
