const path = require('path');
const webpack = require('webpack');
const failPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './app/main.ts',
    vendor: [
      'axios',
      'blueimp-md5',
      'classnames',
      'history',
      'jquery',
      'jquery-sticky',
      'moment',
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'underscore',
      'uuid',
      'wolfy87-eventemitter',
    ],
  },
  output: {
    path: path.resolve(__dirname, './out/assets'),
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }) },
      { test: /\.ttf/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.svg/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.woff2?/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.eot/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.html$/, loader: 'html-loader' },
    ],
  },
  plugins: [
    failPlugin,
    new webpack.ProvidePlugin({
      $: "jquery",
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].[chunkhash].js' }),
    new HtmlWebpackPlugin({
      filename: '../index.ejs',
      template: './app/index.html',
    }),
  ],
  devtool: 'source-map',
};
