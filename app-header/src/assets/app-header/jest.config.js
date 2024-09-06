
module.exports = config => {
	return Object.assign({}, config, {
		transformIgnorePatterns: [
			'/node_modules/(?!@insight).+\\.js$'
		],
		verbose: false,
    moduleDirectories: [
      'node_modules',
      '__tests__'
    ],
    moduleNameMapper: {
      "api": "<rootDir>/src/api/us",
      "test-utils": "<rootDir>/src/__tests__/test-utils.js",
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js']
	})
}
