import ExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'

const getPostCSSLoader = isLegacy => {
	if (isLegacy) {
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

const getStyleLoader = (isDev, isServer) => {
	if (isServer) {
		return
	}

	return isDev ? 'style-loader' : ExtractPlugin.loader
}

const getBaseRules = (isDev, isLegacy, isServer) => {
	const cssLoader = isServer ? 'css-loader/locals' : 'css-loader'
	const postCssLoader = !isServer && getPostCSSLoader(isLegacy)
	const styleLoader = getStyleLoader(isDev, isServer)
	return [ styleLoader, cssLoader, postCssLoader ].filter(Boolean)
}

export default (isDev, isLegacy, isServer) => {
	const baseRules = getBaseRules(isDev, isLegacy, isServer)
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
