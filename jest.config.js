const jestConfig = require('kcd-scripts/jest')

module.exports = Object.assign(jestConfig, {
  setupTestFrameworkScriptFile: require.resolve(
    './other/setup-test-framework.js',
  ),
})
