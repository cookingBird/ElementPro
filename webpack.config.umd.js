const { merge } = require('webpack-merge');
const path = require('path');
const config = require('./webpack.config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


const umdCfg = {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'lib/umd'),
		filename: '[name].js',
		library: {
			name: '[name]',
			type: 'umd'
		}
	},
	optimization: {
		minimize: true,
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},
	plugins: [new MiniCssExtractPlugin()],
}

module.exports = merge(config, umdCfg)
