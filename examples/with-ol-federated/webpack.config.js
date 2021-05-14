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
        { from: `${__dirname}/../../dist/*.js` },
        { from: `${__dirname}/../../dist/*.css` },
        { from: `${__dirname}/../test/sentinel.html` },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
    }),
  ],
};
