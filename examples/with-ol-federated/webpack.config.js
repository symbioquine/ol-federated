const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;


module.exports = {
  entry: {
    'main': `${__dirname}/src/index.js`,
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
      name: 'ol-federated-example-consumer',
      remotes: {
        // Expect the ol-federated `ol.js` entrypoint to be in the same location
        // as this example's JS
        ol: `ol@./ol.js`,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '../dist/*.js' },
        { from: '../dist/*.css' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
