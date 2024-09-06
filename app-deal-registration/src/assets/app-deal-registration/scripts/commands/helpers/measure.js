const {
	measureFileSizesBeforeBuild,
	printFileSizesAfterBuild
} = require('react-dev-utils/FileSizeReporter')

async function measureFiles(targets) {
	const filtered = targets.filter(({ key }) => key !== 'server')
	return Promise.all(filtered.map(({ path }) => measureFileSizesBeforeBuild(path)))
}

async function printSizes(results, prevSizes) {
	const chunkSize = 1024 * 250
	const gzipSize = 1024 * 100

	return Promise.all(results.map(result => {
		const { path, key, stats } = result
		const targetRoot = key === 'legacy' ? 'legacy' : 'modern'
		const prevSize = prevSizes
			.map(size => {
				if (size.root === path) {
					return size
				}
				return false
			})
			.filter(Boolean) 
		console.log(prevSize)
		return printFileSizesAfterBuild(stats, prevSize, prevSize.root, chunkSize, gzipSize)
	}))
}


module.exports = { measureFiles, printSizes }