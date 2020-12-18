var FileChanger = require("webpack-file-changer");
var fs = require("fs");
var path = require("path");

getPlugins = function() {
	var optionsDev = {
		change: [{
			file: path.join(__dirname, '../fhirql/src/main/resources/WEB-INF/templates/index.html'),
			parameters: {'bundle\.(.+)\.js': 'bundle.js'}
		}]		
	}
	var optionsBuild = {
		change: [{
			file: '../fhirql/src/main/resources/WEB-INF/templates/index.html',
			parameters: {
				'bundle(\..+)?\.js': 'bundle.js'
			},
			// delete all but most recent bundle
			before: function(stats, change) {
				var dir = './public/';
				var files = fs.readdirSync(dir)
					.filter(function (name) { return /bundle\.(.+)\.js/.test(name) } )
					.sort(function(a, b) {
						return fs.statSync(path.join(dir, b)).mtime.getTime() -
							fs.statSync(path.join(dir, a)).mtime.getTime();
					})
					.forEach(function(name, i) {
						if (i > 0) fs.unlinkSync(path.join(dir, name))
					})
				return true;
			}
		}]
	};
	var options = process.env.WEBPACK_ENV === 'build' ? optionsBuild : optionsDev;
	return [ new FileChanger(options) ]
};

module.exports = {
	entry: './src/index.coffee',
	plugins: getPlugins(),
	output: {
		filename: (process.env.WEBPACK_ENV === 'build' ? '../fhirql/src/main/resources/js/bundle.js' : 'bundle.js')
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
        		exclude: /node_modules/,
        		query: {
          			presets: ['@babel/react', '@babel/env']
        		}
			},
			{
				test: /\.cjsx$/,
				loader: "coffee-loader",
				options: {
					transpile: {
						presets: ["@babel/preset-react"]
					}
				}
			},
			{
				test: /\.coffee$/,
				loader: "coffee-loader",
				options: {
					transpile: {
						presets: ["@babel/preset-react"]
					}
				}
			}
		]
	},
	resolve: {
		extensions: [".jsx", ".cjsx", ".coffee", ".js"],
		modules: ["js", "node_modules"]
	}
};
