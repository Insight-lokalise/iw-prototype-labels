const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { getBuildOptimization } = require('../utils')
const base = require('./base')

module.exports = function client(options) {
	const env = { ...options.env, legacy: !!options.legacy, server: false }
	const { paths } = options
	const config = base(env, options)

	config.output = {
		chunkFilename: env.dev ? '[name].js' : '[name].[chunkhash:8].js',
		filename: env.dev ? '[name].js' : '[name].[chunkhash:8].js',
		library: {
			type: 'var',
			name: 'appDealReg'
		},
		path: env.legacy
			? `${paths.build}/legacy`
			: `${paths.build}/modern`,
		publicPath: env.legacy ? '/legacy/' : '/modern/'
	}

	config.plugins = [
		...config.plugins,
		new HtmlPlugin({
			filename: env.legacy ? 'index-legacy.html' : 'index.html',
			inject: true,
			template: options.paths.template
		})
	]

	if (env.legacy) {
		config.entry = [
			'@babel/polyfill',
			'custom-event-polyfill',
			'whatwg-fetch',
			paths.clientEntry
		]
	} else if (options.watch) {
		config.entry = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', paths.clientEntry]
	} else {
		config.entry = { main: paths.clientEntry }
	}

	if (env.dev) {
		config.output.pathinfo = true
		config.output.path = options.paths.build
		config.output.publicPath = '/'

		config.plugins = [
			...config.plugins,
			new webpack.HotModuleReplacementPlugin()
		]

		return config
	}

	config.performance = {
		hints: 'warning',
		maxEntrypointSize: 1000 * 1024
	}

	config.plugins = [
		...config.plugins,
		new webpack.DefinePlugin({
			'process.env.IS_WATCH': JSON.stringify(!!options.watch),
			'process.env.NODE_ENV': JSON.stringify(env.dev ? 'development' : 'production')
		}),
		new ExtractPlugin({
			allChunks: true,
			chunkFilename: '[contenthash].css',
			filename: '[contenthash].css'
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		options.watch && new webpack.HotModuleReplacementPlugin({}),
		options.analyze && new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			defaultSizes: 'gzip',
			openAnalyzer: true
		})
	].filter(Boolean)

	config.optimization = getBuildOptimization(env)
	
	return config
}
