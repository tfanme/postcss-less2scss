const postcss = require('postcss');

/**
 * Convert Less spin to SCSS adjust_hue()
 */
const convertSpin = (decl) => {
    const spinRegex = /spin\(/;
    if (decl.value.match(spinRegex)) {
        decl.value = decl.value.replace(spinRegex, 'adjust_hue(');
    }
    return decl;
};

/**
 * variables convertion
 * @param root
 */
const handleVariables = (root) => {
    // variables declaration
    root.walkAtRules(atRule => {
        console.log('atRule = ', atRule);
    });
    root.walkRules(rule => {
        console.log('rule = ', rule);
        console.log('rule.empty = ', rule.empty);
    });
    root.walkDecls(decl => {
        console.log('decl.prop = ', decl.prop, ', decl.value = ', decl.value);
        convertSpin(decl);
        const variableRegex = /@/g;
        if (decl.prop.match(variableRegex)) {
            decl.prop = decl.prop.replace(variableRegex, '$');
        }
        if (decl.value.match(variableRegex)) {
            decl.value = decl.value.replace(variableRegex, '$');
        }
    });
    // variables reference
};

/**
 * mix-in convertion
 * @param root
 */
const handleMixin = (root) => {
    // mix-in properties from existing styles
    root.walkRules(rule => {
        const { selector, params, mixin } = rule;
        console.log('rule.selector = ', selector,
            ', rule.params = ', params,
            ', rule.mixin = ', mixin);
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
            rule.selector = selector.replace(/@/g, '$')
                .replace(/;/g, ',')
                .replace('.', '@include ');
        }
        // const variableRegex = /@/;
        // if (decl.prop.match(variableRegex)) {
        //     decl.prop = decl.prop.replace(variableRegex, '$');
        // }
        // if (decl.value.match(variableRegex)) {
        //     decl.value = decl.value.replace(variableRegex, '$');
        // }
    });
    // variables reference
};

module.exports = postcss.plugin('postcss-less2scss', function (opts) {
    opts = opts || {};
    console.log('opts = ', opts);
    // Work with options here

    return function (root) {
        // Transform CSS AST here
        handleVariables(root);
        handleMixin(root);
    };
});
