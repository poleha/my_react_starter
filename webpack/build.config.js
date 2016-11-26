const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(projectRootPath, './dist');

module.exports = {
  entry: [
    'bootstrap-loader/extractStyles',
    //'webpack-hot-middleware/client',
    './src/index',
  ],
  output: {
    publicPath: '/dist/',
  },

  module: {
    loaders: [
     // {
      //  test: /\.less$/,
      //  loader: ExtractTextPlugin.extract(
            // activate source maps via loader query
       //     'css?sourceMap!' +
       //     'less?sourceMap'
       // )
     // },
     // {
     //   test: /\.sass$/,
     //   loader: ExtractTextPlugin.extract(
     //       // activate source maps via loader query
     //       'css?sourceMap!' +
     //       'less?sourceMap'
     //   )
     // }
    ]
  },

  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      __DEVELOPMENT__: false,
    }),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),

  ],
};







