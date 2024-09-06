import webpack from 'webpack'
import AssetPlugin from 'assets-webpack-plugin'
import path from 'path'

import paths from '../../paths'
import { getBabelConfig, getCompilerName, getCssConfig } from '../utls'

export default function baseConfig({
	isDev,
	isLegacy,
	isServer
}) {

	const compilerName = getCompilerName(isLegacy, isServer)
	const babelOptions = getBabelConfig(isServer, isLegacy)
	const cssOptions = getCssConfig(isDev, isLegacy, isServer)


	return {
		name: compilerName,
		target: isServer ? 'node' : 'web',
		mode: isDev ? 'development' : 'production',
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: babelOptions
					}
				},
				...cssOptions,
				{
					test: /\.svg$/,
					use: {
						loader: 'url-loader'
					}
				}
			]
		},
		resolve: {
			alias: {
				api: path.join(paths.src, 'api/us'),
				components: path.join(paths.src, 'components'),
				lib: path.join(paths.src, 'lib'),
				pages: path.join(paths.src, 'pages'),
				services: path.join(paths.src, 'services'),
				state: path.join(paths.src, 'state'),
				ui: path.join(paths.src, 'ui')
			}
		},
		plugins: [
			new AssetPlugin({
				filename: `${compilerName}.json`,
				path: ''
			})
		]
	}
}
