
module.exports = config => Object.assign({}, config, {
  rootDir: "./src",
  transformIgnorePatterns: [
    '/node_modules/(?!@insight).+\\.js$'
  ],
  verbose: true,
  moduleDirectories: [
    'node_modules',
    '__tests__'
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js']
	})
