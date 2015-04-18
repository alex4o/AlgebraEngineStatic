var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: ["./src/js/main.js"],

    output: {
        filename: "./res/bundle.js",   
    },
    module: {
    	loaders: [
	        { 
	        	test: /\.js$/,
	        	exclude: /node_modules/,
	        	loader: 'babel?cacheDirectory=true'
	        },
	        {
	        	test: /\.sass?$/,

	        	loader: "style!css!sass?indentedSyntax"
	    	}
	    ]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/html/index.html',
			filename: 'res/index.html' 
		})
	],
    resolve: {
  		modulesDirectories: ["node_modules", "bower_components"],
  	},
}