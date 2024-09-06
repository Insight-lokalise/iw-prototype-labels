const { clientConfig } = require('./configs')


module.exports = function createConfig(options, type) {
	if (type === 'client') {
		return clientConfig(options)
	}

	if (type === 'legacy') {
		return clientConfig({ ...options, legacy: true })
	}
}
