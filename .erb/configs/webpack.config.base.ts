/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';
import path from 'path';
require('dotenv').config();

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    alias: {
      '@/config': path.resolve(webpackPaths.srcPath, 'config'),
      '@/contract': path.resolve(webpackPaths.srcPath, 'contract'),
      '@/styles': path.resolve(webpackPaths.srcRendererPath, 'styles'),
      '@/views': path.resolve(webpackPaths.srcRendererPath, 'views'),
      '@/messages': path.resolve(webpackPaths.srcRendererPath, 'messages'),
      '@/hooks': path.resolve(webpackPaths.srcRendererPath, 'hooks'),
      '@/components': path.resolve(webpackPaths.srcRendererPath, 'components'),
      '@/utils': path.resolve(webpackPaths.srcRendererPath, 'utils'),
      '@/store': path.resolve(webpackPaths.srcRendererPath, 'store'),
      '@/locale': path.resolve(webpackPaths.srcRendererPath, 'locale'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
