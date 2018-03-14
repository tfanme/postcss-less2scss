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

/* eslint-disable max-len */
//
// variables
//
/**
 * variables
 */
it('variables - declaration outof any rules', () => {
    var input = '@link-color: #428bca;';
    var output = '$link-color: #428bca;';
    return run(input, output, {});
});

it('variables - declaration inside nested rules', () => {
    var input = `
        #main {
          @width: 5em;
          width: @width;
        }
    `;
    var output = `
        #main {
          $width: 5em;
          width: $width;
        }
    `;
    return run(input, output, {});
});

it('variables - declaration inside nested rules', () => {
    var input = `
        #main {
          @width: 5em;
          width: @width;
        }
    `;
    var output = `
        #main {
          $width: 5em;
          width: $width;
        }
    `;
    return run(input, output, {});
});

it('variables - reference as a single value or part of a value', () => {
    var input = `
        @text-color: @gray-dark;
        @link-color-hover:  darken(@link-color, 10%);
    `;
    var output = `
        $text-color: $gray-dark;
        $link-color-hover:  darken($link-color, 10%);
    `;
    return run(input, output, {});
});

it('variables - reference in nested rules', () => {
    var input = `
        a:hover {
          color: @link-color-hover;
        }
    `;
    var output = `
        a:hover {
          color: $link-color-hover;
        }
    `;
    return run(input, output, {});
});

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

it('variables - do not convert at-rule: @charset', () => {
    var input = '@charset "utf-8";';
    return run(input, input, {});
});

// it('variables - dont convert at-rule: @import', () => {
//     var input = `
//         @import url("fineprint.css") print;
//         @import url("bluish.css") projection, tv;
//         @import 'custom.css';
//         @import url("chrome://communicator/skin/");
//         @import "common.css" screen, projection;
//         @import url('landscape.css') screen and (orientation:landscape);
//     `;
//     return run(input, input, {});
// });

it('variables - dont convert at-rule: @namespace', () => {
    var input = `
        @namespace url(http://www.w3.org/1999/xhtml);
        @namespace svg url(http://www.w3.org/2000/svg);
        
        a {}
        
        /* This matches all SVG <a> elements */
        svg|a {}
        
        /* This matches both XHTML and SVG <a> elements */
        *|a {}
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @media', () => {
    var input = `
        /* Media query */
        @media screen and (min-width: 900px) {
          article {
            padding: 1rem 3rem;
          }
        }
        
        /* Nested media query */
        @supports (display: flex) {
          @media screen and (min-width: 900px) {
            article {
              display: flex;
            }
          }
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @support', () => {
    var input = `
        @supports (display: grid) {
          div {
            display: grid;
          }
        }
                
        @supports not (display: grid) {
          div {
            float: right;
          }
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @document', () => {
    var input = `
        @document url("https://www.example.com/") {
          h1 {
            color: green;
          }
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @document', () => {
    var input = `
        @document url("https://www.example.com/") {
          h1 {
            color: green;
          }
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @page', () => {
    var input = `
        @page {
          margin: 1cm;
        }
        
        @page :first {
          margin: 2cm;
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @font-face', () => {
    var input = `
        @font-face {
          font-family: "Open Sans";
          src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
               url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @keyframes', () => {
    var input = `
        @keyframes slidein {
          from {
            margin-left: 100%;
            width: 300%;
          }
        
          to {
            margin-left: 0%;
            width: 100%;
          }
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @viewport', () => {
    var input = `
        @viewport {
          width: device-width;
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @counter-style', () => {
    var input = `
        @counter-style thumbs {
          system: cyclic;
          symbols: "\\1F44D";
          suffix: " ";
        }
        
        ul {
          list-style: thumbs;
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert at-rule: @font-feature-values', () => {
    var input = `
        /* At-rule for "nice-style" in Font One */
        @font-feature-values Font One {
          @styleset {
            nice-style: 12;
          }
        }
        
        /* At-rule for "nice-style" in Font Two */
        @font-feature-values Font Two {
          @styleset {
            nice-style: 4;
          }
        } 
        
        …
        
        /* Apply the at-rules with a single declaration */
        .nice-look {
          font-variant-alternates: styleset(nice-style);
        }
    `;
    return run(input, input, {});
});

it('variables - dont convert @plugin At-rules of Less', () => {
    var input = `
        @plugin "my-plugin";
        .show-me-pi {
          value: pi();
        }
        .el-1 {
            @plugin "lib1";
            value: foo();
        }
        .el-2 {
            @plugin "lib2";
            value: foo();
        }
    `;
    return run(input, input, {});
});

//
// mixin
//
/**
 * Real world example from bootstrap:
 * https://github.com/twbs/bootstrap/blob/v3.4.0-dev/less/mixins/alerts.less
 */
it('mixin - definition', () => {
    var input = `
        .alert-variant(@background; @border; @text-color) {
          background-color: @background;
          border-color: @border;
          color: @text-color;
        
          hr {
            border-top-color: darken(@border, 5%);
          }
          .alert-link {
            color: darken(@text-color, 10%);
          }
        }
    `;
    var output = `
        @mixin alert-variant($background, $border, $text-color) {
          background-color: $background;
          border-color: $border;
          color: $text-color;
        
          hr {
            border-top-color: darken($border, 5%);
          }
          .alert-link {
            color: darken($text-color, 10%);
          }
        }
    `;
    return run(input, output, {});
});

it('mixin - definition without params', () => {
    var input = `
        .center-block() {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
    `;
    var output = `
        @mixin center-block() {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
    `;
    return run(input, output, {});
});

it('mixin - usage without parenthesis and parameters', () => {
    var input = `
        .a {
            .center-block;
        }
    `;
    var output = `
        .a {
            @include center-block;
        }
    `;
    return run(input, output, {});
});

it('mixin - usage with parenthesis', () => {
    var input = `
        .a {
            .center-block();
        }
    `;
    var output = `
        .a {
            @include center-block();
        }
    `;
    return run(input, output, {});
});

it('mixin - mixin usage - with parenthesis and parameters(convert spin to adjust_hue at the same time)', () => {
    var input = `
        @border-radius-base:        4px;
        
        //== Form states and alerts
        //
        //## Define colors for form feedback states and, by default, alerts.
        
        @state-success-text:             #3c763d;
        @state-success-bg:               #dff0d8;
        @state-success-border:           darken(spin(@state-success-bg, -10), 5%);
        
        @state-info-text:                #31708f;
        @state-info-bg:                  #d9edf7;
        @state-info-border:              darken(spin(@state-info-bg, -10), 7%);
        
        @state-warning-text:             #8a6d3b;
        @state-warning-bg:               #fcf8e3;
        @state-warning-border:           darken(spin(@state-warning-bg, -10), 5%);
        
        @state-danger-text:              #a94442;
        @state-danger-bg:                #f2dede;
        @state-danger-border:            darken(spin(@state-danger-bg, -10), 5%);
        
        //## Define alert colors, border radius, and padding.
        
        @alert-padding:               15px;
        @alert-border-radius:         @border-radius-base;
        @alert-link-font-weight:      bold;
        
        @alert-success-bg:            @state-success-bg;
        @alert-success-text:          @state-success-text;
        @alert-success-border:        @state-success-border;
        
        @alert-info-bg:               @state-info-bg;
        @alert-info-text:             @state-info-text;
        @alert-info-border:           @state-info-border;
        
        @alert-warning-bg:            @state-warning-bg;
        @alert-warning-text:          @state-warning-text;
        @alert-warning-border:        @state-warning-border;
        
        @alert-danger-bg:             @state-danger-bg;
        @alert-danger-text:           @state-danger-text;
        @alert-danger-border:         @state-danger-border;
        
        .alert-variant(@background; @border; @text-color) {
          background-color: @background;
          border-color: @border;
          color: @text-color;
        
          hr {
            border-top-color: darken(@border, 5%);
          }
          .alert-link {
            color: darken(@text-color, 10%);
          }
        }
        
        .alert-success {
          .alert-variant(@alert-success-bg; @alert-success-border; @alert-success-text);
        }
        
        .alert-info {
          .alert-variant(@alert-info-bg; @alert-info-border; @alert-info-text);
        }
        
        .alert-warning {
          .alert-variant(@alert-warning-bg; @alert-warning-border; @alert-warning-text);
        }
        
        .alert-danger {
          .alert-variant(@alert-danger-bg; @alert-danger-border; @alert-danger-text);
        }
    `;
    var output = `
        $border-radius-base:        4px;
        
        //== Form states and alerts
        //
        //## Define colors for form feedback states and, by default, alerts.
        
        $state-success-text:             #3c763d;
        $state-success-bg:               #dff0d8;
        $state-success-border:           darken(adjust_hue($state-success-bg, -10), 5%);
        
        $state-info-text:                #31708f;
        $state-info-bg:                  #d9edf7;
        $state-info-border:              darken(adjust_hue($state-info-bg, -10), 7%);
        
        $state-warning-text:             #8a6d3b;
        $state-warning-bg:               #fcf8e3;
        $state-warning-border:           darken(adjust_hue($state-warning-bg, -10), 5%);
        
        $state-danger-text:              #a94442;
        $state-danger-bg:                #f2dede;
        $state-danger-border:            darken(adjust_hue($state-danger-bg, -10), 5%);
        
        //## Define alert colors, border radius, and padding.
        
        $alert-padding:               15px;
        $alert-border-radius:         $border-radius-base;
        $alert-link-font-weight:      bold;
        
        $alert-success-bg:            $state-success-bg;
        $alert-success-text:          $state-success-text;
        $alert-success-border:        $state-success-border;
        
        $alert-info-bg:               $state-info-bg;
        $alert-info-text:             $state-info-text;
        $alert-info-border:           $state-info-border;
        
        $alert-warning-bg:            $state-warning-bg;
        $alert-warning-text:          $state-warning-text;
        $alert-warning-border:        $state-warning-border;
        
        $alert-danger-bg:             $state-danger-bg;
        $alert-danger-text:           $state-danger-text;
        $alert-danger-border:         $state-danger-border;
        
        @mixin alert-variant($background, $border, $text-color) {
          background-color: $background;
          border-color: $border;
          color: $text-color;
        
          hr {
            border-top-color: darken($border, 5%);
          }
          .alert-link {
            color: darken($text-color, 10%);
          }
        }
        
        .alert-success {
          @include alert-variant($alert-success-bg, $alert-success-border, $alert-success-text);
        }
        
        .alert-info {
          @include alert-variant($alert-info-bg, $alert-info-border, $alert-info-text);
        }
        
        .alert-warning {
          @include alert-variant($alert-warning-bg, $alert-warning-border, $alert-warning-text);
        }
        
        .alert-danger {
          @include alert-variant($alert-danger-bg, $alert-danger-border, $alert-danger-text);
        }
    `;
    return run(input, output, {});
});
