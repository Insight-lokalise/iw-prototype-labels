const options = [
	{
		name: 'analyze',
		type: Boolean
	},
	{
		name: 'mode',
		type: String
	},
	{
		name: 'target',
		type: String
	},
	{
		name: 'watch',
		type: Boolean
	}
]


module.exports = {
	analyze: {
		description: 'Analyzes the production build',
		options
	},
	build: {
		description: 'Builds a production version of the application',
		options
	},
  start: {
    description: 'Start a production version of the server',
    options
  },
	watch: {
		description: 'Builds a hot-reloaded development environment',
		options
	}
}
