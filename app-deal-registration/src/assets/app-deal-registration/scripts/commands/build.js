const webpack = require('webpack')
const clean = require('./clean')
const { compileTargets, createCompileTarget } = require('./helpers/compilation')
const { prepareDirAfterBuild } = require('./helpers/files')
const { measureFiles, writeFileSizes } = require('./helpers/measure')

module.exports = async function build(options) {
	try {
		// Measure the previous file sizes and create the compile targets
		const targets = createCompileTarget(options)
		await clean('build', options)

		// Create the builds
		const results = await compileTargets(targets)
		// Print the output sizes from the latest build results
		//await writeFileSizes(results)

		await prepareDirAfterBuild(options)

		console.log('All builds finished')
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
