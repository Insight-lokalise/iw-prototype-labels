
module.exports = config => {
	return Object.assign({}, config, {
		transformIgnorePatterns: [
      '/node_modules/(?!(@insight|lodash-es)).+\\.js$',
		],
		verbose: false,
    moduleDirectories: [
      'node_modules',
      '__tests__'
    ],
    moduleNameMapper: {
      "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    setupFiles: [
      "./jest-test-setup.js"
    ],
    setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.js']
	})
}
