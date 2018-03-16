const replaceSelectors = (selectors, styles, code) => {
  // let index = 0
  const selectorIds = selectors.reduce((acc, selector) => {
    if (selector.includes('[data-css-')) {
      acc.add(/\[data-css-(.*)\]/g.exec(selector)[1])
    } else if (selector.includes('.css-')) {
      acc.add(/\.css-([^ >]*)/g.exec(selector)[1])
    }
    return acc
  }, new Set())
  return Array.from(selectorIds).reduce((string, id, index) => {
    return string.split(id).join(index)
  }, `${styles}\n\n${code}`)
}

module.exports = {replaceSelectors}
