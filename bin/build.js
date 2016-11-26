const webpack = require('webpack');
const webpackConfig = require('../webpack/common.config');
const compiler = webpack(webpackConfig);
compiler.run(function (error, stats) {
    console.log(error, stats)
})