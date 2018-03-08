const postcss = require('postcss');

/**
 * variables convertion
 * @param root
 */
const handleVariables = (root) => {
    // variables declaration
    root.walkRules(rule => {
        console.log('rule = ', rule);
        console.log('rule.empty = ', rule.empty);
    });
    // variables reference
};

module.exports = postcss.plugin('postcss-less2scss', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (root) {
        // Transform CSS AST here
        handleVariables(root);
    };
});
