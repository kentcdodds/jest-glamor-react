const serializer = require('./dist/serializer')
const {toHaveStyleRule} = require('./matchers')

module.exports = serializer
module.exports.toHaveStyleRule = toHaveStyleRule
