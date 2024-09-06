const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const base = require('./base')

module.exports = function serverConfig(options) {
	const env = { ...options.env, legacy: false, server: true }
	const config = base(env, options)

	config.node = {
		__console: false,
		__dirname: false,
		__filename: false
	}

	config.entry = [options.paths.serverEntry]
	config.output = {
		filename: 'server.js',
		library: {
			type: 'commonjs2',
			name: 'server'
		},
		path: options.paths.build,
		publicPath: '/'
	}

	config.externals = [
		nodeExternals({
			whitelist: [
				/\.(eot|woff|woff2|ttf|otf)$/,
				/\.(svg|png|jpg|jpeg|gif|ico)$/,
				/\.(mp4|mp3|ogg|swf|webp)$/,
				/\.(css|scss|sass|sss|less)$/
			].filter(Boolean)
		})		
	]

	config.plugins = [
		...config.plugins,
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]

	/* Temporarily comment out this block until Dennis can modify scripts
	 if (env.dev) {
		config.watch = true
		config.entry.unshift('webpack/hot/poll?300')

		config.plugins = [
			...config.plugins,
			new webpack.HotModuleReplacementPlugin()
		]
	} */

	return config
}
