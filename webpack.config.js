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
	        	loader: 'babel-loader?cacheDirectory=true'
	        },
	        {
	        	test: /\.sass?$/,

	        	loader: "style-loader!css-loader!sass-loader"
	    	}
	    ]
		},
    resolve: {
  		modulesDirectories: ["node_modules", "bower_components"],
  	},
}