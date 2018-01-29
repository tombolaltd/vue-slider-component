'use strict'
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const commonConfig = require('./common-config');
const loaders = require('./loaders');

module.exports = {
  context: commonConfig.paths.context,
  entry: {
    "index": "src/index.ts"
  },
  output: {
    path: commonConfig.paths.baseDistributionDirectory,
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: [".ts", ".js", ".html", ".less", ".vue"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    plugins: [
        new TsConfigPathsPlugin({
            baseUrl: "./",
            configFile: "tsconfig.json",
            logLevel: "info"
      })
    ]
  },
  module: {
    rules: [
      loaders.tslint, 
      loaders.vue,
      loaders.ts, 
      loaders.less, 
      loaders.images,
      loaders.fonts
    ]
  },
  plugins: commonConfig.plugins,
  node: commonConfig.node
}