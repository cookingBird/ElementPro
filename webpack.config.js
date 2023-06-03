const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	devtool: 'source-map',
	entry: {
		ElementUiPro: path.resolve(__dirname, './src/index.js')
	},
	resolve: {
		extensions: ['.js', '.mjs', '.css', '.vue'],
		alias: {
			"@": path.resolve(__dirname, './src')
		},
		fallback: {},
	},
	experiments: {
		outputModule: true,
	},
	plugins: [new VueLoaderPlugin(), new CleanWebpackPlugin()],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: ['postcss-preset-env']
							}
						}
					}
				]
			},
		]
	}
}
