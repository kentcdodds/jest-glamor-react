const css = require('css')
const {styleSheet} = require('glamor')

const getClassNames = (node, classNames) => {
  if (node.children && node.children.reduce) {
    classNames = node.children.reduce(
      (acc, child) => acc.concat(getClassNames(child, acc)),
      classNames,
    )
  }
  const className = node.props && (node.props.className || node.props.class)
  if (className) {
    return classNames.concat(className.toString().split(' '))
  }
  return []
}

const getStyles = classNames => {
  const styles = styleSheet.tags
    .map(tag => /* istanbul ignore next */ tag.textContent || '')
    .join('\n')
  const ast = css.parse(styles)
  ast.stylesheet.rules = ast.stylesheet.rules.filter(
    rule =>
      rule.type === 'rule' &&
      classNames.includes(rule.selectors[0].substring(1)),
  )

  const ret = css.stringify(ast)
  return ret
}

const serializer = {
  test(val) {
    return !val.withStyles && val.$$typeof === Symbol.for('react.test.json')
  },

  print(val, print) {
    const classNames = getClassNames(val, [])
    const styles = getStyles(classNames)
    val.withStyles = true
    const printedVal = print(val)
    if (styles) {
      return `${styles}\n\n${printedVal}`
    } else {
      return printedVal
    }
  },
}

module.exports = serializer
