const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = function getBuildOptimization({ dev, legacy }) {
	if (dev) return

	return {
		moduleIds: 'hashed',
		minimize: true,
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					compress: {
						comparisons: false,
						ecma: legacy ? 5 : 6,
						inline: 2,
						warnings: false
					},
					mangle: {
						safari10: true
					},
					output: {
						comments: /^\**!|@preserve|@license|@cc_on/,
						ecma: legacy ? 5 : 6
					},
					parse: {
						ecma: 8
					}
				}
			}),
			new OptimizeCssAssetsPlugin({
				map: {
					annotation: true,
					inline: false
				}
			})
		],
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
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
					test: /[\\/]node_modules[\\/]/
				}
			},
			maxInitialRequests: Infinity
		}
	}
}