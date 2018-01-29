'use strict'
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    entry: {
        "polyfills": ["core-js/es6/object", "core-js/es6/function", "core-js/es6/array", "core-js/es6/string", "core-js/es6/number", "core-js/es6/promise"],
        "main": "./demo/src/main.ts"
      },
    devtool : 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'All Calls Panel',
            template: path.resolve(baseWebpackConfig.context, './demo/index.html')
        })
    ]
    ,
    devServer: {
        contentBase: 'dist',
        host: '0.0.0.0',
        disableHostCheck: true
    }
});