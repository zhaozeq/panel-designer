'use strict';
const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

export default {
  alias: {
    '@components': resolve('src/components'),
    '@utils': resolve('src/utils'),
    '@models': resolve('src/models'),
    '@routes': resolve('src/routes'),
    '@services': resolve('src/services'),
  },
};
