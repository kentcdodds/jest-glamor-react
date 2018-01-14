const {replaceClassNames} = require('./replace-class-names')
const {getNodes, markNodes, getSelectors, getStyles} = require('./utils')

function createSerializer(styleSheet, classNameReplacer) {
  function test(val) {
    return val &&
      !val.withStyles &&
      val.$$typeof === Symbol.for('react.test.json')
  }

  function print(val, printer) {
    const nodes = getNodes(val)
    markNodes(nodes)
    const selectors = getSelectors(nodes)
    const styles = getStyles(selectors, styleSheet)
    const printedVal = printer(val)
    if (styles) {
      return replaceClassNames(
        selectors,
        styles,
        printedVal,
        classNameReplacer,
      )
    } else {
      return printedVal
    }
  }

  return {test, print}
}

// doing this to make it easier for users to mock things
// like switching between development mode and whatnot.
const getGlamorStyleSheet = () => require('glamor').styleSheet
const glamorSerializer = createSerializer(getGlamorStyleSheet)
createSerializer.test = glamorSerializer.test
createSerializer.print = glamorSerializer.print

module.exports = createSerializer
