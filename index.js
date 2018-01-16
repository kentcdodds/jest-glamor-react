const serializer = require('./dist/serializer')
const {toHaveStyleRule} = require('./dist/matchers')

module.exports = serializer
module.exports.toHaveStyleRule = toHaveStyleRule
