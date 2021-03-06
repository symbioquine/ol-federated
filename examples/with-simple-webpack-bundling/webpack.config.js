const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    'main': `${__dirname}/src/index.js`,
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /bootstrap\.js$/,
        loader: "bundle-loader",
        options: {
          lazy: true,
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: `${__dirname}/../../dist/*.css` },
        { from: `${__dirname}/../test/sentinel.html` },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
    }),
  ],
};
