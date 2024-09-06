const webpack = require('webpack')
const formatMessages = require('react-dev-utils/formatWebpackMessages')
const { createConfig } = require('../../webpack')

function tryCompiler(config) {
	let compiler

	try {
		compiler = webpack(config)
	} catch (err) {
		console.log(err)
		process.exit(1)
	}

	return compiler
}

function createCompileTarget(options) {
	const targets = [{
		compiler: tryCompiler(createConfig(options, 'client')),
		key: 'client',
		path: `${options.paths.build}/modern`
	}, {
		compiler: tryCompiler(createConfig(options, 'legacy')),
		key: 'legacy',
		path: `${options.paths.build}/legacy`
	}]

	return targets
}

function handleCompilation(compiler, key) {
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			let messages

			if (err) {
				if (!err.message) {
					return reject(err)
				}

				messages = formatMessages({
					errors: [err.message],
					warnings: []
				})
			} else {
				messages = formatMessages(stats.toJson({
					all: false,
					errors: true,
					warnings: true
				}))
			}

			if (messages.errors.length > 0) {
				messages.errors = messages.errors.filter(msg => {
					return !(msg.includes('Attempted import error') || msg.includes('Module not found:'))
				})

				if (messages.errors.length > 0) {
					return reject(new Error(messages.errors.join('\n\n')))
				}
			}

			return resolve({
				key,
				stats,
				warnings: messages.warnings
			})
		})
	})
}

async function compileTargets(targets) {
	const results = await Promise.all(targets.map(target => handleCompilation(target.compiler, target.key)))
	return results.reduce((acc, curr) => {
		const { key, stats, warnings } = curr
		const target = targets.find(item => item.key === key)
		const { compiler, ...rest } = target
		return [ ...acc, { ...rest, key, stats, warnings }]
	}, [])
}

module.exports = {
	compileTargets,
	createCompileTarget,
	handleCompilation,
	tryCompiler
}