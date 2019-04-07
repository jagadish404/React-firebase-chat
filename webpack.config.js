module.exports = {
  mode: process.env.mode === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
      { test: /\.(gif|png|jpe?g|svg)$/i, loader: [ 'file-loader' ] }
    ]
  }
};
