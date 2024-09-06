module.exports = function getOptionsFromArgs(args = {}, config) {
	const keys = Object.keys(args)
	if (keys.length > 0) {
		return keys.reduce((acc, curr) => {
			if (curr === 'target') {
				acc[curr] = args[curr]
				acc.env = { ...(acc.env || {}), [curr]: true }
				return acc
			}

			acc[curr] = true
			return acc
		}, config)
	}
	
	if (process.env.WATCH) {
		config.watch = true
	}

	return config
}
