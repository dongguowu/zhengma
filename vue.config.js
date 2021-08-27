module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production' ? '/zhengma/' : '/',
}
