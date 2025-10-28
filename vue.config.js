module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  },
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/zhengma/' : '/',
};
