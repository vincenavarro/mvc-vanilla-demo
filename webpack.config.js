// Webpack configuration

// Import plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	// The first file to start with
	entry: './src/js/App.js',

	// Where should the build go
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[hash].js',
	},

	// Loads modules last to first.
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				enforce: 'pre',
				use: {
					loader: 'eslint-loader', // Announces lint errors on compile attempt
					options: {
						emitWarning: true,
					},
				},
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader', // Converts and merges javascript into a clean, compatible bundle
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader, // Drops CSS into a bundle
					'css-loader', // Resolves URL and imports of css
					'postcss-loader', // Autoprefixer and minifier
					'sass-loader', // Converts SASS to CSS
				],
			},
			{
				/*
        Now we apply rule for these file types
        Separate rules can be made for fonts,
        documents, etc to apply different loaders
        and options (ex. image processing)
        */
				test: /\.(png|jpe?g|gif|svg)$/,
				use: [
					{
						// Using file-loader for these files
						loader: 'file-loader',
						options: {
							name: '[hash].[ext]',
							esModule: false,
						},
					},
				],
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin(), // Cleans build folder to avoid unused
		new HtmlWebpackPlugin({ title: 'Simple Webpack Demo', template: './src/templates/App.html'}), // Generates HTML from scratch containing pack files
		new MiniCssExtractPlugin({ filename: '[hash].css' }), // Writes CSS pack to build
	],
};
