var path = require('path')
var MiniCssExractPlugin = require('mini-css-extract-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'out'),
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: [MiniCssExractPlugin.loader, 'css-loader', 'less-loader']
        }, {
            test: /\.js$/,
            use: ['babel-loader']
        }, {
            test: /\.(png|jpg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 28,
                    name: '[name].[ext]'
                }
            }]
        }, {
            test: require.resolve('zepto'),
            loader: 'exports-loader?window.Zepto!script-loader'
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './index.html'
        }),
        new MiniCssExractPlugin({
            filename: '[name].css'
        })
    ],
    mode: 'development'
}
//2358