const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const express = require('express');


module.exports = {
  entry: {
    'main': `${__dirname}/src/index.js`,
  },
  output: {
    clean: true,
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxAsyncRequests: 15,
      maxInitialRequests: 15,
    },
  },
  resolve: {
    alias: {
      'ol': `${__dirname}/node_modules/ol-src/build/ol`,
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
    new ModuleFederationPlugin({
      name: 'olNaiveHostContainer',
      library: {
        type: 'assign-properties',
        name: 'olNaiveHostContainer',
      },
      exposes: {
        './ol-dot-js': `${__dirname}/node_modules/ol-src/build/index.js`,
      },
      shared: [
        'ol/'
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${__dirname}/../../dist/ol.css` },
        { from: `${__dirname}/../test/sentinel.html` },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
    }),
  ],
};
