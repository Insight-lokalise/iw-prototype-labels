import webpack from 'webpack'
import HtmlPlugin from 'html-webpack-plugin'
import ExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import paths from '../../paths'
import base from './base'

export default function clientConfig({
	env,
	mode,
	options
}) {
	const isDev = env.dev
	const isLegacy = mode === 'legacy'

	const config = base({
		isDev,
		isLegacy,
		isServer: false
	})

	const outputPath = isLegacy
		? `${paths.build}/legacy`
		: `${paths.build}/modern`

	config.entry = isLegacy
		? ['@babel/polyfill', 'custom-event-polyfill', 'whatwg-fetch', paths.clientEntry]
		: { main: paths.clientEntry }


	const publicPath = isLegacy ? '/static/legacy/' : '/static/modern/'
	if (isDev) {
		config.output = {
			chunkFilename: '[name].js',
			filename: '[name].js',
			library: {
				type: 'var',
				name: 'appDealReg'
			},
			path: paths.build,
			pathinfo: true,
			publicPath: publicPath
		}

		return config
	}

	config.performance = {
		hints: 'warning',
		maxEntrypointSize: 1000 * 1024
	}

	config.output = {
		chunkFilename: '[contenthash].js',
		filename: '[contenthash].js',
		library: {
			type: 'var',
			name: 'appDealReg'
		},
		path: outputPath,
		publicPath
	}

	config.plugins = [
		...config.plugins,
		new ExtractPlugin({
			allChunks: true,
			chunkFilename: '[contenthash].css',
			filename: '[contenthash].css'
		}),
		new HtmlPlugin({
			filename: isLegacy ? 'index-legacy.html' : 'index.html',
			template: paths.template,
			inject: true
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		options.analyze && new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			defaultSizes: 'gzip',
			openAnalyzer: true
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
	 	})
	].filter(Boolean)

	config.optimization = {
		moduleIds: 'hashed',
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					compress: {
						ecma: isLegacy ? undefined : 6
					}
				}
			})
		],
		splitChunks: {
			cacheGroups: {
				default: false,
				defaultVendors: false,
				common: {
					chunks: 'all',
					enforce: true,
					minChunks: 2,
					name: 'common',
					priority: 10,
					reuseExistingChunk: true
				},
				vendor: {
					chunks: 'all',
					name: 'vendor',
					priority: 20,
					test: /node_modules/
				}
			}
		}
	}

	return config
}
