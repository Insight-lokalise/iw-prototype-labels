const { emptyDir } = require('fs-extra')

// Empties a provided directory
module.exports = function clean(path, options) {
	return emptyDir(options.paths[path])
}
