var path = require('path')
var es2015 = require('babel-preset-es2015');
var stage_1 = require('babel-preset-stage-1');

var webpack = require("webpack");
// var ProgressPlugin = require('webpack/lib/ProgressPlugin');

var defaultStatsOptions = {
	colors: false,
	hash: false,
	timings: false,
	chunks: false,
	chunkModules: false,
	modules: false,
	children: true,
	version: true,
	cached: false,
	cachedAssets: false,
	reasons: false,
	source: false,
	errorDetails: false,
};

exports.init = function(src, entry, dist, isCompress){	
	
	var webpackConfig = { 
	    context: src,
	    entry: entry,
	    output: {
	        path: dist,
	        filename: '[name].js'
	    },
	   
	    plugins:[
	        new webpack.NoErrorsPlugin()
	    ],

	    resolveLoader: {
			root: path.join(__dirname, '..', 'node_modules')
		},

	    module: {
	        loaders: [
	            {
	              test: /\.js$/,
	              exclude: /(node_modules|bower_components)/,
	              loader: 'babel-loader'
	            }
	        ]
	    },
	    babel: {
	        presets: [es2015, stage_1]
	    }
	}

	if(isCompress){
		webpackConfig.plugins.push(  
			new webpack.optimize.UglifyJsPlugin({
		      compress: {
		        warnings: false
		      }
		    })
  		)
	}

	var compiler = webpack(webpackConfig);

	 // compiler.apply(new ProgressPlugin(function(percentage, msg) {
	 //        percentage = Math.floor(percentage * 100);
	 //        msg = percentage + '% ' + msg;
	 //        if (percentage < 10) msg = ' ' + msg;
	 //        console.log(msg);
	 //    }));

	compiler.run(function(err, stats) {
		var res = stats.toString(defaultStatsOptions);
		res = res.replace('Version: webpack 1.13.3', '');
     	console.log(res);
	});
}

