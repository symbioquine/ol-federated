const webpack = require('webpack');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
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
    new SaveRemoteFilePlugin([
      {
          url: 'https://raw.githubusercontent.com/openlayers/openlayers.github.io/master/en/v6.5.0/build/ol.js',
          filepath: 'ol.js',
          hash: false,
      },
    ]),
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
  externals: function ({context, request}, callback) {
    // Externalize all OpenLayers `ol` imports
    if (/^ol(\/.*)?$/.test(request)) {
      const modifiedRequest = request
        // Remove '.js' suffix - if present
        .replace(/\.js$/, "")
        // Replace filesystem separators '/' with module separators '.'
        .replace(/\//g, ".");
      return callback(null, modifiedRequest);
    }
  
    // Continue without externalizing the import
    callback();
  },
};
