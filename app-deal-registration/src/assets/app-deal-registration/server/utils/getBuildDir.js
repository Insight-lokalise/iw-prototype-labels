const path = require('path')

module.exports = function getBuildDir(target = '') {
	if (target !== 'local') {
		return process.cwd()
	}

	if (process.env.WATCH) {
		// This means that we are in watch mode, which is webpack running
		// our server code with dev and hot middleware. This changes things
		// because webpack serves this from an in memory file-system
		console.log(__dirname)
	}

  return path.resolve(__dirname, '../../build')
}
