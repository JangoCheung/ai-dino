module.exports = {
  entry: {
    'ai-dino': './src/ai-dino',
  },
  target: 'web',
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devtool: 'source-map',
  devServer: {
    open: false,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    port: '3000',
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    hot: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/png',
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
  ],
  externals: {}
};
