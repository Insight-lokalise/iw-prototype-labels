const { copy, readJson, writeFile } = require('fs-extra')
const path = require('path')
const { getEnvConfig } = require('./env')
async function copyPackageJSON({ paths }) {
	const file = await readJson(paths.packageJSON)
	return writeFile(`${paths.build}/package.json`, JSON.stringify(file), 'utf-8')
}

async function copyAssets({ paths }) {
	return copy(paths.assets, `${paths.build}/assets`)
}

async function copyNodeModules({ paths }) {
	return copy(paths.modules, `${paths.build}/node_modules`)
}

async function copyEnvFiles(options) {
	const envConfig = getEnvConfig(options.target)
	const fileContents = Object.keys(envConfig).reduce((acc, key) => {
		return `${acc} ${key}=${envConfig[key]}\n`
	}, '')

	const filePath = `${options.paths.root}/.env.server`
	return writeFile(filePath, fileContents, 'utf8')
}

function prepareDirAfterBuild(options) {
	return Promise.all([
		copyAssets(options),
		copyPackageJSON(options),
	])
}

module.exports = {
	copyEnvFiles,
	prepareDirAfterBuild
}