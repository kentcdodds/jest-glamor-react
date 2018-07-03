const css = require('css')

function getNodes(node, nodes = []) {
  if (node.children) {
    const children =
      typeof node.children === 'function' ? node.children() : node.children
    if (Array.isArray(children)) {
      children.forEach(child => getNodes(child, nodes))
    }
  }

  if (typeof node === 'object') {
    nodes.push(node)
  }

  return nodes
}

function markNodes(nodes) {
  nodes.forEach(node => {
    node.serializedWithJestGlamorReact = true
  })
}

function getSelectors(nodes) {
  return nodes.reduce((selectors, node) => {
    if (node instanceof global.HTMLElement) {
      return getSelectorsFromDOM(selectors, node)
    } else {
      return getSelectorsFromProps(selectors, node)
    }
  }, [])
}

// eslint-disable-next-line
function getSelectorsFromProps(selectors, node) {
  const props = typeof node.props === 'function' ? node.props() : node.props
  if (!props) return []
  const className = props.className || props.class
  if (className) {
    selectors = selectors.concat(
      className
        .toString()
        .split(' ')
        .map(cn => `.${cn}`),
    )
  }
  const dataProps = Object.keys(props).reduce((dProps, key) => {
    if (key.startsWith('data-')) {
      dProps.push(`[${key}]`)
    }
    return dProps
  }, [])
  if (dataProps.length) {
    selectors = selectors.concat(dataProps)
  }
  return selectors
}

function getSelectorsFromDOM(selectors, node) {
  const root = document.createElement('div')
  root.appendChild(node)
  const allChildren = root.querySelectorAll('*')
  selectors = Array.from(allChildren).reduce((s, c) => {
    s.push(...Array.from(c.classList).map(cn => `.${cn}`))
    s.push(
      ...c
        .getAttributeNames()
        .filter(key => key.startsWith('data-'))
        .map(key => `[${key}]`),
    )
    return s
  }, selectors)
  return selectors
}

function filterChildSelector(baseSelector) {
  if (baseSelector.slice(-1) === '>') {
    return baseSelector.slice(0, -1)
  }
  return baseSelector
}

function getAST(nodeSelectors, styleSheet) {
  const tags =
    typeof styleSheet === 'function' ? styleSheet().tags : styleSheet.tags
  const styles = tags
    .map(tag => /* istanbul ignore next */ tag.textContent || '')
    .join('\n')
  const ast = css.parse(styles)
  const rules = ast.stylesheet.rules.filter(filter)
  const mediaQueries = getMediaQueries(ast, filter)

  ast.stylesheet.rules = [...rules, ...mediaQueries]

  return ast

  function filter(rule) {
    if (rule.type === 'rule') {
      return rule.selectors.some(selector => {
        const baseSelector = filterChildSelector(
          selector.split(/:| |\./).filter(s => !!s)[0],
        )
        return nodeSelectors.some(
          sel => sel === baseSelector || sel === `.${baseSelector}`,
        )
      })
    }
    return false
  }
}

function getStylesAndAllSelectors(nodeSelectors, styleSheet) {
  const ast = getAST(nodeSelectors, styleSheet)
  const allSelectors = ast.stylesheet.rules.reduce((s, r) => {
    if (r.selectors) {
      s.push(...r.selectors)
    }
    return s
  }, [])
  const styles = css.stringify(ast)
  return {styles, allSelectors}
}

function getMediaQueries(ast, filter) {
  return ast.stylesheet.rules
    .filter(rule => rule.type === 'media' || rule.type === 'supports')
    .reduce((acc, mediaQuery) => {
      mediaQuery.rules = mediaQuery.rules.filter(filter)

      if (mediaQuery.rules.length) {
        return acc.concat(mediaQuery)
      }

      return acc
    }, [])
}

function shouldDive(node) {
  return typeof node.dive === 'function' && typeof node.type() !== 'string'
}

function isTagWithClassName(node) {
  return node.prop('className') && typeof node.type() === 'string'
}

function getClassNameFromEnzyme(received) {
  const tree = shouldDive(received) ? received.dive() : received
  const components = tree.findWhere(isTagWithClassName)
  return components.length && components.first().prop('className')
}

function getClassNameFromTestRenderer(received) {
  return received.props.className || received.props.class
}

function getClassNameFromCheerio(received) {
  /* istanbul ignore next */
  if (received[0].type === 'root') {
    // I'm honestly not sure we need this, but it was here
    // and I don't want to break it...
    return received
      .children()
      .first()
      .attr('class')
  } else {
    return received.attr('class')
  }
}

// eslint-disable-next-line complexity
function getClassNames(received) {
  let className

  if (received) {
    if (received instanceof HTMLElement) {
      className = received.className
    } else if (received.$$typeof === Symbol.for('react.test.json')) {
      className = getClassNameFromTestRenderer(received)
    } else if (typeof received.findWhere === 'function') {
      className = getClassNameFromEnzyme(received)
    } else if (received.cheerio === '[cheerio object]') {
      className = getClassNameFromCheerio(received)
    }
  }

  return className ? className.split(/\s/) : []
}

module.exports = {
  getNodes,
  markNodes,
  getSelectors,
  getAST,
  getStylesAndAllSelectors,
  getClassNames,
}
