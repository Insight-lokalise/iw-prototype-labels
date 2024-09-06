const commandLineArgs = require('command-line-args')
const commandLineCommands = require('command-line-commands')

const schema = require('./schema')
const { getOptions } = require('./options')

const validCommands = Object.keys(schema)

async function exec() {
	const { argv, command } = commandLineCommands(validCommands, process.argv.slice(2))
	const args = commandLineArgs(schema[command].options, { argv })
	const options = getOptions(args)

	try {
		const commandFn = require(`./commands/${command}`)
		await commandFn(options)
	} catch (err) {
		console.error('Error')
		if (err.stack) {
			console.error(err.stack)
		}

		process.exit(1)
	}
}

process.nextTick(exec)
