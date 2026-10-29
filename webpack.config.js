/* eslint-disable max-lines-per-function */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (_, argv) => ({
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      // CAMBIO A: título y viewport del HTML
      title: 'DEFIDER USM',
      meta: {
        viewport: 'width=device-width, initial-scale=1, viewport-fit=cover'
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            // CAMBIO B: no exigir "import React" en cada archivo
            ['@babel/preset-react', { runtime: 'automatic' }]
          ]
        }
      },
      {
        test: /\.s?css$/,
        use: argv.mode === 'production'
          ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          : ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    port: 5050,
    hot: false,
    historyApiFallback: {
      index: '/'
    }
  }
})
