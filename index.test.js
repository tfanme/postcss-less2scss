var postcss = require('postcss');
var less = require('postcss-less');

var plugin = require('./');

function run(input, output, opts) {
    return postcss([plugin(opts)]).process(input, { syntax: less })
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

/**
 * variables
 */
it('variables - declaration & reference', () => {
    var input = `
// Variables
@link-color:        #428bca; // sea blue
@link-color-hover:  darken(@link-color, 10%);

// Usage
a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}
`;
    var output = `
// Variables
$link-color:        #428bca; // sea blue
$link-color-hover:  darken($link-color, 10%);

// Usage
a,
.link {
  color: $link-color;
}
a:hover {
  color: $link-color-hover;
}
.widget {
  color: #fff;
  background: $link-color;
}
`;
    return run(input, output, {});
});
