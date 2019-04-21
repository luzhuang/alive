const path = require('path');
const Config = require('webpack-chain');

const config = new Config();
config.entry('index')
  .add('./src/index.js')

config.output
  .filename('[name].js')
  .path(path.resolve(__dirname, './dist'))
  .library('Alive')
  .libraryTarget('umd')
  .publicPath('/dist/')

module.exports = config.toConfig();