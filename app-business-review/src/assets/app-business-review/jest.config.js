
module.exports = config => Object.assign({}, config, {
		transformIgnorePatterns: [
			'/node_modules/(?!@insight).+\\.js$'
		],
		verbose: false,
    moduleDirectories: [
      'node_modules',
      '__tests__'
    ],
    moduleNameMapper: {
      "api": "<rootDir>/src/api/us"
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js']
	})
