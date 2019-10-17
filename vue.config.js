module.exports = {
  devServer: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:34567',
        pathRewrite: { '^/api' : '' }
      }
    }
  }
};
