const path = require('path');
const vendorsPath = path.resolve('./node_modules');

module.exports = {
    entry: {
        // "echarts-soap": './src/echarts-soap.js',
        "demo":"./demo.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dev'),
        publicPath: '/assets/'
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
        }]
    }
    ,
    resolve:{
            alias: {
                "echarts-soap": path.resolve('./src/') + '/echarts-soap.js'
            }
        },
    devtool: 'inline-source-map',
    devServer: {
        index: 'index.html'
    }
};