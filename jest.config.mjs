/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  rootDir: './src',
  coverageDirectory: '<rootDir>../coverage',
  globalTeardown: '<rootDir>../jest/teardown.config.mjs',
  globalSetup: '<rootDir>../jest/setup.config.mjs',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>../tsconfig.spec.json',
      },
    ],
  },
};
