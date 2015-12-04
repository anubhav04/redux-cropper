var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'eval',
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	resolveLoader: {
		'fallback': path.join(__dirname, 'node_modules')
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: ['react-hot', 'babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.module.scss$/,
				loader: 'style-loader!css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
			},
			{
				test: /^((?!\.module).)*scss$/,
				loader: 'style!css!sass'
			},
			{
		      test: /\.(png|jpg)$/,
		      loader: 'url'
		    }
		]
	}
};

var reduxSrc = path.join(__dirname, '..', 'src');
var reduxNodeModules = path.join(__dirname, '..', 'node_modules');
var fs = require('fs');
if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
	module.exports.resolve = {
		alias: {
			'redux-cropper': reduxSrc,
			'react$': path.resolve(__dirname, './node_modules/react/react.js'),
			'react/addons$': path.resolve(__dirname, './node_modules/react/addons.js')
		}
	};
	module.exports.module.loaders.push({
		test: /\.js$/,
		loaders: ['babel'],
		include: reduxSrc
	})
}
