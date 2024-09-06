const baseConfig = {
	presets: ['@babel/react'],
	plugins: [
		['inline-react-svg', {
			svgo: false
		}],
		['@babel/plugin-proposal-class-properties'],
		['@babel/plugin-proposal-object-rest-spread']
	]
}

const getServerConfig = () => ({
	...baseConfig,
	presets: [
		['@babel/preset-env', {
			modules: 'commonjs'
		}]
	]
})

const getClientConfig = isLegacy => {
	const config = {
		...baseConfig,
		plugins: [
			['@babel/plugin-syntax-dynamic-import'],
			...baseConfig.plugins
		]
	}

	if (isLegacy) {
		return {
			...config,
			presets: [
				['@babel/preset-env', {
					modules: 'commonjs',
					useBuiltIns: 'entry'
				}],
				...config.presets
			]
		}
	}

	return config
}

export default (isServer, isLegacy) => {
	return isServer ? getServerConfig() : getClientConfig(isLegacy)
}
