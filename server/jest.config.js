module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
    },
  },
  testTimeout: 30000,
};
