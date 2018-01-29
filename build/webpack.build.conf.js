'use strict'
const path = require('path');
const util = require('util');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    externals: {
        // Hyper important, without these the UMD will build, 
        // it'll even display, but if the underlying model updates
        // it throws up errors on every change. AFAICT the vue "context"
        // is different if these are not excluded.
        vuePropertyDecorator:'vue-property-decorator',
        vue: 'vue'
    },
    output: {
        library: 'bingoAllCallPanel',
        libraryTarget: 'umd'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
          root: baseWebpackConfig.context,
          verbose: true,
          dry: false
        })
    ]
});