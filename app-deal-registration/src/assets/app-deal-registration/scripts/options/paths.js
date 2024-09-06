const path = require('path')

const rootDir = path.resolve(__dirname, '../..')
const withRoot = relative => path.resolve(rootDir, relative)

module.exports = {
	assets: withRoot('src/assets'),
	build: withRoot('build'),
	clientEntry: withRoot('src/index.js'),
	modules: withRoot('node_modules'),
	packageJSON: withRoot('package.json'),
	root: rootDir,
	serverEntry: withRoot('server/server.js'),
	src: withRoot('src'),
	template: withRoot('src/index.html')
}
