const path = require('path')
const createApp = require('./createApp')
const { getBuildDir } = require('./utils')

module.exports = function createServer(options) {
  const target = options.target || process.env.TARGET || 'local'
  const app = createApp(options, target)
  const buildDir = options.paths.build
  app.get('*', (req, res) => {
    const browserName = res.locals.browser
    const fileName = browserName === 'IE'
      ? '/legacy/index-legacy.html'
      : '/modern/index.html'
    res.sendFile(path.join(buildDir, fileName))
  })

	return app
}



