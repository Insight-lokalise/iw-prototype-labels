const baseConfig = {
	presets: [
		'@babel/react']
	,
	plugins: [
		['inline-react-svg', {
			svgo: false
		}],
		['@babel/plugin-proposal-class-properties'],
		['@babel/plugin-proposal-object-rest-spread']
	]
}

const getClientConfig = legacy => {
	const config = {
		...baseConfig,
		plugins: [
			['@babel/plugin-syntax-dynamic-import'],
			['react-hot-loader/babel'],
			...baseConfig.plugins
		]
	}

	if (legacy) {
		return {
			...config,
			presets: [...config.presets, [
				'@babel/preset-env', {
					modules: 'commonjs'
				}
			]]
		}
	}

	return config
}


module.exports = function getBabelConfig({ dev, legacy, server }) {
	// TODO: Server
	return getClientConfig(legacy)
}
