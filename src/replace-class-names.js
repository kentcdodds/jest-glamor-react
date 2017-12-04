function defaultClassNameReplacer(className, index) {
  return `glamor-${index}`
}

const replaceClassNames = (
  selectors,
  styles,
  code,
  replacer = defaultClassNameReplacer,
) => {
  let index = 0
  return selectors.reduce(
    (acc, className) => {
      if (className.indexOf('.css-') === 0) {
        const escapedRegex = new RegExp(
          className
            .replace('.', '')
            .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
          'g',
        )
        return acc.replace(escapedRegex, replacer(className, index++))
      }
      return acc
    },
    `${styles ? `${styles}\n\n` : ''}${code}`,
  )
}

module.exports = {replaceClassNames}
