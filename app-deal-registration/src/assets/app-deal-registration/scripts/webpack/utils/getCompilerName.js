module.exports = function getCompilerName({ legacy, server }) {
	if (legacy) {
		return 'client-legacy'
	}

	return server ? 'server' : 'client'
}
