const {getAST, getClassNames} = require('./utils')

const getGlamorStyleSheet = () => require('glamor').styleSheet

function valueMatches(declaration, value) {
  return value instanceof RegExp ?
    value.test(declaration.value) :
    value === declaration.value
}

function toHaveStyleRule(received, property, value) {
  const selectors = getClassNames(received)
  const ast = getAST(selectors, getGlamorStyleSheet())

  const classNames = getClassNames(received)
  const rules = ast.stylesheet.rules.filter(rule =>
    classNames.some(cn => rule.selectors.includes(`.${cn}`)))

  const declaration = rules
    .reduce((decs, rule) => Object.assign([], decs, rule.declarations), [])
    .filter(dec => dec.type === 'declaration' && dec.property === property)
    .pop()

  if (!declaration) {
    return {
      pass: false,
      message: () => `Property not found: ${property}`,
    }
  }

  const pass = valueMatches(declaration, value)

  const message = () =>
    `Expected ${property}${pass ? ' not ' : ' '}to match:\n` +
    `  ${value}\n` +
    'Received:\n' +
    `  ${declaration.value}`

  return {
    pass,
    message,
  }
}

module.exports = {
  toHaveStyleRule,
}
