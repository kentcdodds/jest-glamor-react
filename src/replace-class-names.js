const replaceClassNames = (selectors, styles, code) => {
  let index = 0
  return selectors.reduce((acc, className) => {
    if (className.indexOf('.css-') === 0) {
      const escapedRegex = new RegExp(
        className.replace('.', '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'g',
      )
      return acc.replace(escapedRegex, `glamor-${index++}`)
    }
    return acc
  }, `${styles}\n\n${code}`)
}

module.exports = {replaceClassNames}
