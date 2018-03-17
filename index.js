const postcss = require('postcss');

/**
 * Convert spin() function of Less to SCSS function adjust_hue()
 * See also: http://lesscss.org/functions/#color-operations-spin
 */
const convertFunctionSpin = (decl) => {
    const spinRegex = /spin\(/;
    if (decl.value.match(spinRegex)) {
        decl.value = decl.value.replace(spinRegex, 'adjust_hue(');
    }
    return decl;
};

/**
 * Convert CSS escaping
 * See also: http://lesscss.org/functions/#string-functions-e
 * node can be decl or rule
 */
const convertFunctionEscapeForCSS = (rule) => {
    const regex = /~['"](.+)['"]/;
    if (rule.selector.match(regex)) {
        rule.selector = rule.selector.replace(regex, '#{$1}');
    }
    return rule;
};

/**
 * Conversion of at-rules
 * @param root
 */
const handleAtRules = (root) => {
    const result = root.walkAtRules(atRule => {
        console.log('AtRule = ', atRule);
        // variables usage
        const variableRegex = /@/g;
        if (atRule.params.match(variableRegex)) {
            atRule.params = atRule.params.replace(variableRegex, '$');
        }
        // convert file extension of @import At-Rules
        if (atRule.name === 'import' && !atRule.params.match(/\.css/) && atRule.params.match(/['"]([a-z0-9-_]+)(\.\S+)?['"]/)) {
            atRule.params = atRule.params.replace(/['"]([a-z0-9-_]+)(\.\S+)?['"]/, '"$1"')
        }
    });
    if (!result) {
        console.log('walkAtRules failed');
    }
};

/**
 * Conversion of declarations
 * @param root
 */
const handleDecls = (root) => {
    const result = root.walkDecls(decl => {
        console.log('decl.prop = ', decl.prop, ', decl.value = ', decl.value);
        convertFunctionSpin(decl);
        const variableRegex = /@/g;
        if (decl.prop.match(variableRegex)) {
            decl.prop = decl.prop.replace(variableRegex, '$');
        }
        if (decl.value.match(variableRegex)) {
            decl.value = decl.value.replace(variableRegex, '$');
        }
    });
    if (!result) {
        console.log('walkDecls iteration was broke');
    }
};

/**
 * Conversion of rules
 * @param root
 */
const handleRules = (root) => {
    // mix-in properties from existing styles
    root.walkRules(rule => {
        const { selector, params, mixin } = rule;
        console.log('rule.selector = ', selector,
            ', rule.params = ', params,
            ', rule.mixin = ', mixin);
        // variables interpolation
        if (selector.match(/\.@{(\S+)}/) && !selector.match(/~['"](.+)['"]/)) {
            console.log('variable interpolation found, selector = ', selector);
            rule.selector = selector.replace(/\.@{(\S+)}/g, '.#{$$$1}');
        }
        // mixin definition
        if (selector.match(/\.\S+\((@\S+(:\s?\S+)?;?\s?)*\)/)) {
            console.log('mixin definition found, selector = ', selector);
            rule.selector = selector.replace(/@/g, '$')
                .replace(/;/g, ',')
                .replace('.', '@mixin ');
        }
        // mixin usage
        if (mixin) {
            console.log('mixin usage, found, selector = ', selector);
            // rule = convertFunctionEscapeForCSS(rule);
            rule.selector = selector
                .replace(/~['"](.+)['"]/, '#{$1}')
                .replace(/@{(\S+)}/, '$$$1')
                .replace(/@/g, '$')
                .replace(/;/g, ',')
                .replace('.', '@include ')
            ;
            console.log('after mixin conversion, rule = ', rule);
        }
    });
    // variables reference
};

module.exports = postcss.plugin('postcss-less2scss', function (opts) {
    opts = opts || {};
    console.log('opts = ', opts);
    // Work with options here

    return function (root) {
        // Transform CSS AST here
        handleAtRules(root);
        handleDecls(root);
        handleRules(root);
    };
});
