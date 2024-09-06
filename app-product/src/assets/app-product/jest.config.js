const env = process.env.INSIGHT_ENV || 'us'

module.exports = (config) => {
  return Object.assign({}, config, {
    moduleNameMapper: {
      '^api$': '<rootDir>/mocks/api.js'
    },
    setupTestFrameworkScriptFile: require.resolve('./jest.setup'),
  })
}
