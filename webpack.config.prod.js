const { merge } = require('webpack-merge');
const path = require('path');
const config = require('./webpack.config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const esCfg = {
	output: {
		path: path.resolve(process.cwd(), 'lib/es'),
		filename: 'index.js',
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'index.css'
		})
	],
}

module.exports = merge(config, esCfg)
