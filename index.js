const postcss = require('postcss')

/**
 * Convert spin() function of Less to SCSS function adjust_hue()
 * See also: http://lesscss.org/functions/#color-operations-spin
 */
const convertFunctionSpin = decl => {
  const spinRegex = /spin\(/
  if (decl.value.match(spinRegex)) {
    decl.value = decl.value.replace(spinRegex, 'adjust_hue(')
  }
  return decl
}

/**
 * convert at-ruels
 * @param atRule
 */
const handleAtRule = atRule => {
  // variables usage
  const variableRegex = /@/g
  if (atRule.params.match(variableRegex)) {
    atRule.params = atRule.params.replace(variableRegex, '$')
  }
}

/**
 * convert @import
 * @param importNode
 */
const handleImport = importNode => {
  // convert file extension of @import At-Rules
  if (
    !importNode.importPath.match(/\.css/) &&
        importNode.importPath.match(/['"]([a-z0-9-_\/]+)(\.\S+)?['"]/)
  ) {
    importNode.importPath = importNode.importPath.replace(
      /['"]([a-z0-9-_\/]+)(\.\S+)?['"]/,
      '"$1"'
    )
  }
}

/**
 * convert comments
 * @param comment
 * @returns {*}
 */
const handleComment = comment => {
  return comment
}

/**
 * convert declarations
 * @param decl
 */
const handleDecl = decl => {
  convertFunctionSpin(decl)

  // CSS escaping
  decl.value = decl.value
    .replace(/@{(\S+)}/, '$$$1')
    .replace(/~['"](.+)['"]/, '#{$1}')

  const variableRegex = /@/g
  // variable inside properties
  if (decl.prop.match(variableRegex)) {
    decl.prop = decl.prop.replace(variableRegex, '$')
  }
  // variable inside values
  if (decl.value.match(variableRegex)) {
    decl.value = decl.value.replace(variableRegex, '$')
  }
}

/**
 * convert rules
 * @param rule
 */
const handleRule = rule => {
  // mix-in properties from existing styles
  const { selector, mixin } = rule
  // variables interpolation
  if (selector.match(/\.@{(\S+)}/) && !selector.match(/~['"](.+)['"]/)) {
    rule.selector = selector.replace(/\.@{(\S+)}/g, '.#{$$$1}')
  }
  // mixin definition
  if (selector.match(/\.\S+\((@\S+(:\s?\S+)?;?\s?)*\)/)) {
    rule.selector = selector
      .replace(/@/g, '$')
      .replace(/;/g, ',')
      .replace('.', '@mixin ')
  }
  // mixin usage
  if (mixin) {
    // rule = convertFunctionEscapeForCSS(rule);
    rule.selector = selector
      .replace(/~['"](.+)['"]/, '#{$1}')
      .replace(/@{(\S+)}/, '$$$1')
      .replace(/@/g, '$')
      .replace(/;/g, ',')
      .replace('.', '@include ')
  }
}

module.exports = postcss.plugin('postcss-less2scss', () => {
  // Work with options here

  return function (root) {
    // Transform CSS AST here
    root.walk(node => {
      switch (node.type) {
        case 'import':
          handleImport(node)
          break
        case 'atrule':
          handleAtRule(node)
          break
        case 'rule':
          handleRule(node)
          break
        case 'decl':
          handleDecl(node)
          break
        case 'comment':
          handleComment(node)
      }
    })
  }
})
