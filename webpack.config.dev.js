var webpack = require('webpack')
var base = require('./webpack.config.base')

base.plugins.push(
  new webpack.DefinePlugin({
    BASE_URI: '"http://localhost:8080"'
  })
)

module.exports = base