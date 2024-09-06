const path = require('path')
const express = require('express')
const { createExpressApp } = require('buildkit-express')
const browser = require('./middleware/browser')
const session = require('./middleware/session')
const { getBuildDir, getProxyTarget } = require('./utils')

module.exports = function createApp(options, target) {
    const buildDir = options.paths.build

	const app = createExpressApp({
		certPath: process.env.CERT_PATH,
		enableCSP: false,
		enableNonce: false,
		keyPath: process.env.KEY_PATH,
		proxyConfig: {
			changeOrigin: true,
			target: getProxyTarget(target),
			ws: true
		},
		proxyRoute: '/dealreg',
		useHTTPS: true
	})

	app.use(browser)
	app.use(session)
	app.use('/', express.static(buildDir))
	app.use('/assets', express.static(`${buildDir}/assets`))

	if (target !== 'local') {
		app.use(require('./middleware/auth'))
		require('./routes/auth')(app)
	}

	return app
}
