const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const vendorsPath = path.resolve('./node_modules');

module.exports =  env => {
    var plugins = [];
    if (env.min) {
        plugins.push(new UglifyJSPlugin({
            sourceMap:true
        }));
        plugins.push(new webpack.SourceMapDevToolPlugin({
            test: /\.min\.js$/,
            filename:'echarts-soap.min.js.map'
        }));
    }
    return {
        entry: {
            echartsSoap: './src/echarts-soap.js'
        },
        // devtool: env.min ? 'cheap-source-map' : false,

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: env.min ? 'echarts-soap.min.js' : 'echarts-soap.js',
            library: ['echartsSoap'],
            libraryTarget: 'umd'
            // sourceMapFilename:'echarts-soap.min.js.map'
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
    }

};
