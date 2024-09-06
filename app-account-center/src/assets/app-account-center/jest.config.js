module.exports = (config) =>
  Object.assign({}, config, {
    transformIgnorePatterns: ['/node_modules/(?!@insight).+\\.js$'],
    verbose: false,
    moduleDirectories: ['node_modules', '__tests__'],
    moduleNameMapper: {
      '@constants': '<rootDir>/src/constants',
      'test-utils': '<rootDir>/src/__tests__/test-utils.js',
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js'],
  })
