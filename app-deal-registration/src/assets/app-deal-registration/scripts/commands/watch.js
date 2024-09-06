const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const { createConfig } = require('../webpack')
const { tryCompiler } = require('./helpers/compilation')

module.exports = async function watch(options) {
	const createApp = require('../../server/createApp')
	const compiler = tryCompiler(createConfig({ ...options, watch: true }, 'client'))
	const app = createApp(options, options.target)

	app.use(webpackDevMiddleware(compiler, {
		historyApiFallback: true,
		hot: true,
		stats: {
			colors: true
		}
	}))

	app.use(webpackHotMiddleware(compiler, {
		heartbeat: 10 * 1000,
		log: console.log,
		path: '/__webpack_hmr'
	}))

	app.get('*', (req, res) => {
		const browserName = res.locals.browser
		const fileName = browserName === 'IE'
			? '/legacy/index-legacy.html'
			: '/modern/index.html'

		res.sendFile(path.join(options.paths.build, fileName))
	})

	app.listen(8082, () => {
		console.log('Dev server listening at localhost:8082')
	})
}
