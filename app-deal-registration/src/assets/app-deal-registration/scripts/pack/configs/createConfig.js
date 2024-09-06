import clientConfig from './client'
import serverConfig from './server'

export default function createConfig(target, env, mode, options = {}) {
	const config = target === 'web' ? clientConfig : serverConfig
	return config({
		env,
		mode,
		options
	})
}

