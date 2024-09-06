const path = require('path')

const namedDirs = ['api', 'components', 'constants', 'context', 'lib', 'hooks', 'pages', 'services', 'state']

module.exports = function createAliases(paths) {
	console.log(paths)
	return namedDirs.reduce((acc, dir) => {
		const passedPath = dir === 'api' ? 'api/us' : dir
		return {
			...acc,
			[dir]: path.join(paths.src, passedPath),
			[`@${dir}`]: path.join(paths.src, passedPath)
		}
	}, {})
}