import clean from './clean'
import { createCompileTarget, compileTargets } from './helpers/compilation'
import { measureFiles, printSizes } from './helpers/measure'


export default async function analyze(options) {
	const targets = createCompileTarget({ ...options, analyze: true })
	const prevSizes = await measureFiles(targets)
	console.log(prevSizes)
	await clean('build', options)

	const results = await compileTargets(targets)
	await printSizes(results, prevSizes)
}
