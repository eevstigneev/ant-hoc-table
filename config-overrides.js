/* global require, module, __dirname */
const {
  override,
  fixBabelImports,
  addLessLoader
} = require('customize-cra');


// config overrides:
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: require('./src/styles/antd-theme.js')
    }
  }),
);
