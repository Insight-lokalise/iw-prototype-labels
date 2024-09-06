const webpack = require('webpack')
const {
	createAliases,
	getBabelConfig,
	getCompilerName,
	getCssConfig
} = require('../utils')

module.exports = function base(env, options) {
	const { paths } = options
	const compilerName = getCompilerName(env)
	const babelOptions = getBabelConfig(env)
	const cssOptions = getCssConfig(env)

	return {
		mode: env.dev ? 'development' : 'production',
		name: compilerName,
		target: env.server ? 'node' : 'web',
		module: {
			strictExportPresence: true,
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: { ...babelOptions, babelrc: false }
					}
				},
				...cssOptions,
				{
					test: /\.svg$/,
					use: {
						loader: 'url-loader'
					}
				}
			]
		},
		resolve: {
			alias: createAliases(paths)
		},
		plugins: [
			new webpack.ProvidePlugin({
				process: 'process/browser',
			})
		]
	}
}
