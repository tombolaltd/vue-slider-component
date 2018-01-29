module.exports = {
    test: /\.(eot|svg|ttf|woff|woff2)?$/,
    loader: 'file-loader',
    options: {
        name: 'fonts/[name].[ext]'
    }
}