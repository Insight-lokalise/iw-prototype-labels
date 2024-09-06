const ExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const getPostCSSLoader = legacy => {
	if (legacy) {
		return {
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: () => [
					require('postcss-flexbugs-fixes'),
					autoprefixer({
						flexbox: 'no-2009'
					})
				]
			}
		}
	}

	return false
}

const getStyleLoader = (dev, server) => {
	if (server) {
		return
	}

	return dev ? 'style-loader' : ExtractPlugin.loader
}

const getBaseRules = ({ dev, legacy, server }) => {
	const cssLoader = server ? 'css-loader/locals' : 'css-loader'
	const postCssLoader = !server && getPostCSSLoader(legacy)
	const styleLoader = getStyleLoader(dev, server)
	return [styleLoader, cssLoader, postCssLoader].filter(Boolean)
}

module.exports = function getCssConfig(env) {
	const baseRules = getBaseRules(env)
	return [
		{
			test: /\.scss$/,
			use: [...baseRules, 'sass-loader']
		},
		{
			test: /\.css$/,
			use: baseRules
		}
	]
}
