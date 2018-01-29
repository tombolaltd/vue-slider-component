const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const extractLess = new ExtractTextPlugin({
//   filename: "[name].css",
//   disable: process.env.NODE_ENV === "development"
// });

module.exports= {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
      loaders: {
        ts: ['ts-loader', { loader: 'tslint-loader', options: { emitErrors: true, failOnHint: true } } , 'leading-line-remover-loader'],
        less: ExtractTextPlugin.extract({
            use: [ 'css-loader', 'less-loader']
            //fallback: 'vue-style-loader'
        })
      },
      esModule: true,
      extractCSS: true
  }
}
