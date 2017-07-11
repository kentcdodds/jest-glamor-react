const replaceClassNames = (selectors, styles, code) => {
  let index = 0
  return selectors.reduce((acc, className) => {
    const escapedRegex = new RegExp(
      className.replace('.', '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
      'g',
    )
    return acc.replace(escapedRegex, `c${index++}`)
  }, `${styles}\n\n${code}`)
}

module.exports = {replaceClassNames}
