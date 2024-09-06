
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

    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js']
	})
}
