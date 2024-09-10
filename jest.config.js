module.exports = {
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: 'tests',
  };