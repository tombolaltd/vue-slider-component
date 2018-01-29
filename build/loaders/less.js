const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader']
    })
}