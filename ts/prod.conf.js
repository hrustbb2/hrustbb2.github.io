const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// npx webpack --config ww.conf.js

module.exports = {
    entry: {
        'spa': [
            './spa/main.ts'
        ],
        'sw': [
            './spa/sw.ts'
        ],
    },
    output: {
        path: path.resolve(__dirname, '../distr/js'),
        filename: '[name].js'
    },
    resolve: {
        // alias: {
        //     '@common': path.resolve(__dirname, '../../../src/Common/assets'),
        // },
        extensions: ['*', '.*', '.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
        ],
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        })],
    },
};