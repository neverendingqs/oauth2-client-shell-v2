const { key, cert } = require('openssl-self-signed-certificate');

module.exports = {
  devServer: {
    https: { key, cert }
  },
}
