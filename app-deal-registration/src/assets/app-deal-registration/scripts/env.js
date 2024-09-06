const path = require('path')
const { existsSync, realpathSync } = require('fs-extra')
const paths = require('./paths')

// Make sure that including paths.js after env.js will read .env variables
delete require.cache[require.resolve('./paths')]

const NODE_ENV = process.env.NODE_ENV

const dotenvFiles = [
	`${paths.dotenv}.${NODE_ENV}.local`,
	`${paths.dotenv}.${NODE_ENV}`,
	`${paths.dotenv}.local`,
	paths.dotenv
]

dotenvFiles.forEach(file => {
	if (existsSync(file)) {
		require('dotenv').config({
			path: file
		})
	}
})

const appDirectory = realpathSync(process.cwd())
const nodePath = (process.env.NODE_PATH || '')
	.split(path.delimiter)
	.filter(folder => folder && !path.isAbsolute(folder))
	.map(folder => path.resolve(appDirectory, folder))
	.join(path.delimiter)

const APP_SPECIFIC = /^APP_/i

module.exports = (target, options) => {
	const defaults = {
		NODE_ENV: process.env.NODE_ENV || 'development',
		IS_DEV: process.env.NODE_ENV === 'development' || options.dev,
		PORT: process.env.PORT || options.port || 8082,
		VERBOSE: !!process.env.VERBOSE,
		HOST: process.env.HOST || options.host || 'localhost',
		ASSET_MANIFEST: paths.appManifest,
		BUILD_TARGET: target === 'web' ? 'client' : 'server',
	}

	const fromEnv = Object.keys(process.env)
		.filter(key => APP_SPECIFIC.test(key))
		.reduce((env, key) => {
			env[key] = process.env[key]
			return env
		}, {})

	const raw = { ...defaults, ...fromEnv }
	const stringified = Object.keys(raw).reduce((env, key) => ({
		...env,
		[`process.env.${key}`]: JSON.stringify(raw[key])
	}), {})

	return { raw, stringified }
}

