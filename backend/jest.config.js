module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: [
    '<rootDir>/../v3/',
    '<rootDir>/../v4/',
    '<rootDir>/../frontend/',
    '<rootDir>/../shared/',
    '<rootDir>/../node_modules/'
  ],
}; 