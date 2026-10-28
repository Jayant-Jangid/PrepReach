module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
