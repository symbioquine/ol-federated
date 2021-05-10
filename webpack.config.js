const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;


const olInfo = require('./node_modules/ol-src/build/info.json');


function generateExposes() {
  const symbols = olInfo.symbols.filter((symbol) => symbol.kind != 'member');

  const exposes = {};

  symbols.forEach(function (symbol) {
    const name = symbol.name;

    if (name.indexOf('#') !== -1) {
      return;
    }

    const parts = name.split(/[~\.]/);

    const module = parts[0].replace(/^module\:/, '');

    const moduleWithoutOlPrefix = module.replace(/^ol\//, '');

    exposes[`./${moduleWithoutOlPrefix}`] = `./node_modules/ol/src/${module}`;
  });

  return exposes;
}

module.exports = {
  entry: {
    'ol': `${__dirname}/src/index.js`,
  },
  output: {
    clean: true,
    chunkFilename: (pathData) => {
      if (/(_js-)?(vendors-)?node_modules_(ol_src_)?/.test(pathData.chunk.id)) {
        const simplerChunkId = pathData.chunk.id
          .replace(/_js-/g, '-')
          .replace(/(vendors-)?node_modules_(ol_src_)?/g, '')
          .replace(/_js$/, '');

        return `${simplerChunkId}.js`;
      }

      return '[name].js';
    },
  },
  optimization: {
    chunkIds: 'named',
  },
  resolve: {
    alias: {
      ol: `${__dirname}/node_modules/ol/src/ol/`,
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' },
        { from: 'node_modules/ol-src/build/ol/ol.css' },
      ],
    }),
    new ModuleFederationPlugin({
      name: 'ol',
      library: {
        type: 'assign-properties',
        name: 'ol',
      },
      exposes: generateExposes(),
    }),
  ],
};
