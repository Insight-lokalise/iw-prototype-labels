const env = require('std-env')
const getOptionsFromArgs = require('./getOptionsFromArgs')
const paths = require('./paths')


const defaultOptions = {
  analyze: false,
  mode: 'spa',
  target: 'local'
}

module.exports = function getOptions(args) {
	const options = {
		...defaultOptions,
		env,
		paths
	}

  return getOptionsFromArgs(args, options)
}
