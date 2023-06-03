const { merge } = require('webpack-merge');
const path = require('path');
const config = require('./webpack.config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(config, {
	mode: 'development',
	// entry: {
	// 	Test: path.resolve(__dirname, './src/test.js')
	// },
	output: {
		path: path.resolve(process.cwd(), 'lib/dev'),
		filename: 'index.js',
		library: {
			type: 'module',
		},
	},
	experiments: {
		outputModule: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'index.css'
		})
	],
})
