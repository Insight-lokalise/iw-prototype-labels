
module.exports = config => ({ ...config , 
		transformIgnorePatterns: [
			'/node_modules/(?!@insight).+\\.js$'
		],
		verbose: false,
    moduleDirectories: [
      'node_modules',
      '__tests__'
    ],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js']
	
})
