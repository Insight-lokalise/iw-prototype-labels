const webpack = require('webpack')
const path = require('path')
const env = require('std-env')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	context: path.resolve(__dirname, 'src'),
	target: 'web',
	mode: env.dev ? 'development' : 'production',
	devServer: {
		contentBase: 'build',
		host: 'localhost',
		port: 8080,
		disableHostCheck: true
	},
	entry: {
		main: path.resolve(__dirname, 'src/index.js')
	},
	output: {
		filename: env.dev ? '[name].js' : '[contenthash].js',
		chunkFilename: env.dev ? '[name].js' : '[contenthash].js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		libraryTarget: 'var',
		pathinfo: true,
		devtoolModuleFilenameTemplate: ({ absoluteResourcePath }) => {
			return path.isAbsolute(absoluteResourcePath)
				? absoluteResourcePath.replace(/\\/g, '/')
				: path.resolve(__dirname, absoluteResourcePath).replace(/\\/g, '/')
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules\/(?!toolkit-*)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-react', {
								development: env.dev,
                                "throwIfNamespace": false // defaults to true
							}],
							['@babel/preset-env', {
								debug: false,
								loose: false,
								modules: false,
								spec: false,

							}]
						],
						plugins: [
							['@babel/plugin-proposal-class-properties', {
								loose: false,

							}],
							['@babel/plugin-proposal-object-rest-spread']
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					env.prod ? ExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
            {
                test: /\.scss$/,
                use: [
                    env.prod ? ExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: {loader: "url-loader"}
            },
		]
	},
	plugins: [
		new ExtractPlugin({
			allChunks: true,
			chunkFilename: env.dev ? '[name].css' : '[contenthash].css',
			filename: env.dev ? '[name].css' : '[contenthash].css'
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(env)
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
			inject: 'body',
		}),
		env.dev && new webpack.NoEmitOnErrorsPlugin(),
		!env.dev && new webpack.HashedModuleIdsPlugin(),
		!env.dev && new webpack.optimize.AggressiveMerggingPlugin()
	].filter(Boolean)
}
