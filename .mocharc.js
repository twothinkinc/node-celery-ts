'use strict'

module.exports = {
    require: ['./node_modules/ts-node/register', './node_modules/source-map-support/register'],
    recursive: true,
    spec: ['test/**/*.spec.ts']
}
