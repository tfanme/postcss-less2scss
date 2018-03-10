const postcss = require('postcss');

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
        const variableRegex = /@/;
        if (decl.prop.match(variableRegex)) {
            decl.prop = decl.prop.replace(variableRegex, '$');
        }
        if (decl.value.match(variableRegex)) {
            decl.value = decl.value.replace(variableRegex, '$');
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
        handleVariables(root);
    };
});
