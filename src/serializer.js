const css = require('css')
const {styleSheet} = require('glamor')

const serializer = {test, print}

module.exports = serializer

function test(val) {
  return !val.withStyles && val.$$typeof === Symbol.for('react.test.json')
}

function print(val, printer) {
  const selectors = getSelectors(val)
  const styles = getStyles(selectors)
  val.withStyles = true
  const printedVal = printer(val)
  if (styles) {
    return `${styles}\n\n${printedVal}`
  } else {
    return printedVal
  }
}

function getSelectors(node) {
  let selectors = []
  if (node.children && node.children.reduce) {
    selectors = node.children.reduce(
      (acc, child) => acc.concat(getSelectors(child)),
      [],
    )
  }
  if (node.props) {
    return getSelectorsFromProps(selectors, node.props)
  }
  return selectors
}

function getSelectorsFromProps(selectors, props) {
  const className = props.className || props.class
  if (className) {
    selectors = selectors.concat(
      className.toString().split(' ').map(cn => `.${cn}`),
    )
  }
  const dataProps = Object.keys(props).reduce(
    (dProps, key) => {
      if (key.startsWith('data-')) {
        dProps.push(`[${key}]`)
      }
      return dProps
    },
    [],
  )
  if (dataProps.length) {
    selectors = selectors.concat(dataProps)
  }
  return selectors
}

function getStyles(nodeSelectors) {
  const styles = styleSheet.tags
    .map(tag => /* istanbul ignore next */ tag.textContent || '')
    .join('\n')
  const ast = css.parse(styles)
  ast.stylesheet.rules = ast.stylesheet.rules.filter(rule => {
    return rule.type === 'rule' &&
      rule.selectors.some(selector => nodeSelectors.includes(selector))
  })

  const ret = css.stringify(ast)
  return ret
}
