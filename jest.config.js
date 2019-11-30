module.exports = {
  globalSetup: './tests/setup.js',
  setupFilesAfterEnv: ['./tests/setup-after-env.js'],
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
