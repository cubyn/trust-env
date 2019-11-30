module.exports = {
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
