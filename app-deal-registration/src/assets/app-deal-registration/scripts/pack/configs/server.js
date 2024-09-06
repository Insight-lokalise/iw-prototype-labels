import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import paths from '../../paths'
import base from './base'

export default function serverConfig({
	env,
	mode,
	options
}) {
	const isDev = env.dev
	const isLegacy = mode === 'legacy'
	const config = base({
		isDev,
		isLegacy,
		isServer: true
	})

	config.entry = [paths.serverEntry]
	config.output = {
		filename: 'server.js',
		library: {
			type: 'commonjs2',
			name: 'server'
		},
		path: paths.build,
		publicPath: '/'
	}
	config.node = {
		__console: false,
		__dirname: false,
		__filename: false
	}

	config.externals = [
		nodeExternals({
			whitelist: [
				isDev ? 'webpack/hot/poll?300' : null,
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

	if (isDev) {
		config.watch = true
		config.entry.unshift('webpack/hot/poll?300')

		config.plugins = [
			...config.plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.WatchIgnorePlugin([paths.appManifest])
		]
	}

	return config
}

module.exports = serverConfig
