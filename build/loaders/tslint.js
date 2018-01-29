module.exports = {
    test: /\.ts$/,
    enforce: 'pre',
    loader: 'tslint-loader',
    options: {
      emitErrors: true,
      failOnHint: true
    }
  }