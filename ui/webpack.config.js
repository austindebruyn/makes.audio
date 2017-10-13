const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: false
})
const plugins = [
  extractSass
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true, compress: { warnings: false } })
  )
}

const devtool = process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'

module.exports = {
  entry: './src/index.coffee',
  devtool: devtool,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'public', 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        use: [ 'coffee-loader' ]
      },
      {
        test: /\.vue$/,
        use: [ {
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?sourceMap',
              sass: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?indentedSyntax&sourceMap'
            }
          }
        } ]
      },
      {
        test: /\.(ttf|woff|woff2|eot|jpg|png|svg)$/,
        use: [ 'file-loader' ]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins,
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: [ '.js', '.json', '.vue', '.coffee' ],
    modules: [ 'node_modules', path.resolve(__dirname, 'src') ]
  }
}
