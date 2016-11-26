var fs = require('fs');
var babelrc = fs.readFileSync('.babelrc');
var config;
var path = require('path');
if (process.env.npm_lifecycle_event == null) {
    process.env.npm_lifecycle_event = 'start-dev';
}
const TARGET = process.env.npm_lifecycle_event;

try {
    config = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}

if (TARGET == 'start-dev') global.__DEVELOPMENT__ = true;
if (TARGET == 'start-prod') {
    global.__DEVELOPMENT__ = false;
    process.env.NODE_ENV = 'production'
}

require('babel-core/register')(config);
require('../src/server');
