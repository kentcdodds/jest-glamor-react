const {replaceSelectors} = require('./replace-selectors')
const {
  getNodes,
  markNodes,
  getSelectors,
  getStylesAndAllSelectors,
} = require('./utils')

function createSerializer(styleSheet, classNameReplacer) {
  function test(val) {
    return (
      val &&
      !val.serializedWithJestGlamorReact &&
      (val.$$typeof === Symbol.for('react.test.json') ||
        (val instanceof HTMLElement && !isBeingSerialized(val)))
    )
  }

  function print(val, printer) {
    const nodes = getNodes(val)
    markNodes(nodes)
    const selectors = getSelectors(nodes)
    const {styles, allSelectors} = getStylesAndAllSelectors(
      selectors,
      styleSheet,
    )
    const printedVal = printer(val)
    if (styles) {
      return replaceSelectors(
        allSelectors,
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

function isBeingSerialized(node) {
  let currentNode = node

  while (currentNode) {
    if (currentNode.serializedWithJestGlamorReact) {
      return true
    }
    currentNode = currentNode.parentNode
  }
  return false
}

// doing this to make it easier for users to mock things
// like switching between development mode and whatnot.
const getGlamorStyleSheet = () => require('glamor').styleSheet
const glamorSerializer = createSerializer(getGlamorStyleSheet)
createSerializer.test = glamorSerializer.test
createSerializer.print = glamorSerializer.print

module.exports = createSerializer
