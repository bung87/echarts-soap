const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const vendorsPath = path.resolve('./node_modules');
const env = require('yargs').argv.mode;
const    isProduction = env === 'prod' || env === 'prodUMD';
var plugins = [];

if (isProduction) {
    plugins.push(new UglifyJsPlugin({ minimize: false }));
    // outputFile = projectName + '.min.js';
}

module.exports = {
    entry: {
        echartsSoap: './src/echarts-soap.js'
    },
    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'echarts-soap.min.js' : 'echarts-soap.js',
        library: ['echartsSoap'],
        libraryTarget: 'umd'
    },
    externals: {
        echarts: 'echarts'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: [require('babel-plugin-transform-object-rest-spread')]
                }
            }
        }],
       noParse: [
                new RegExp(vendorsPath + '/echarts/echarts.js')
        ]
    },
    resolve: {
            alias: {
                echarts: vendorsPath + '/echarts'
            }
    },
    plugins: plugins

};