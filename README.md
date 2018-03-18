# PostCSS Less2scss [![Build Status][ci-img]][ci]

[PostCSS] plugin to convert Less to SCSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/princetoad/postcss-less2scss.svg
[ci]:      https://travis-ci.org/princetoad/postcss-less2scss

## Convert Variables

### Overview

* Variables - Declaration out of any rules

Less:
```less
@link-color: #428bca;
```

Scss:
```scss
$link-color: #428bca;
```

* Variables - Declaration inside nested rules

Less:
```less
#main {
  @width: 5em;
  width: @width;
}
```

Scss:
```scss
#main {
  $width: 5em;
  width: $width;
}
```

* Variables - Reference as a single value or part of a value

Less:
```less
@text-color: @gray-dark;
@link-color-hover:  darken(@link-color, 10%);
```

Scss:
```scss
$text-color: $gray-dark;
$link-color-hover:  darken($link-color, 10%);
```

* Variables - Reference as a single value or part of a value in nested rules

Less:
```less
a:hover {
  color: @link-color-hover;
}
```

Scss:
```scss
a:hover {
  color: $link-color-hover;
}
```

* Convert variables inside At-Rules

Less:
```less
@screen-sm:                  768px;
@screen-sm-min:              @screen-sm;

.form-inline {

  // Kick in the inline
  @media (min-width: @screen-sm-min) {
    // Inline-block all the things for "inline"
    .form-group {
      display: inline-block;
      margin-bottom: 0;
      vertical-align: middle;
    }
  }
}
```

Scss:
```scss
$screen-sm:                  768px;
$screen-sm-min:              $screen-sm;

.form-inline {

  // Kick in the inline
  @media (min-width: $screen-sm-min) {
    // Inline-block all the things for "inline"
    .form-group {
      display: inline-block;
      margin-bottom: 0;
      vertical-align: middle;
    }
  }
}
```

### Variable Interpolation

* Convert selectors

Less:
```less
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```
Scss:
```scss
// Variables
$my-selector: banner;

// Usage
.#{$my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```

## Mixins conversion

* Convert mixins definition

Less:
```less
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
```

Scss:
```scss
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
```

* Convert mixins usage

Less:
```less
.a {
    .center-block;
}
```

Scss:
```scss
.a {
    @include center-block;
}
```

* Support default value of parameters

Less:
```less
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

.box-shadow(@shadow) {
  -webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1
          box-shadow: @shadow;
}

.form-control-validation(@text-color: #555; @border-color: #ccc; @background-color: #f5f5f5) {
  // Color the label and help text
  .help-block,
  .control-label,
  .radio,
  .checkbox,
  .radio-inline,
  .checkbox-inline,
  &.radio label,
  &.checkbox label,
  &.radio-inline label,
  &.checkbox-inline label  {
    color: @text-color;
  }
  // Set the border and box shadow on specific inputs to match
  .form-control {
    border-color: @border-color;
    .box-shadow(inset 0 1px 1px rgba(0,0,0,.075)); // Redeclare so transitions work
    &:focus {
      border-color: darken(@border-color, 10%);
      @shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px lighten(@border-color, 20%);
      .box-shadow(@shadow);
    }
  }
  // Set validation states also for addons
  .input-group-addon {
    color: @text-color;
    border-color: @border-color;
    background-color: @background-color;
  }
  // Optional feedback icon
  .form-control-feedback {
    color: @text-color;
  }
}

// Feedback states
.has-success {
  .form-control-validation(@state-success-text; @state-success-text; @state-success-bg);
}
.has-warning {
  .form-control-validation(@state-warning-text; @state-warning-text; @state-warning-bg);
}
.has-error {
  .form-control-validation(@state-danger-text; @state-danger-text; @state-danger-bg);
}
```

Scss:
```scss
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

@mixin box-shadow($shadow) {
  -webkit-box-shadow: $shadow; // iOS <4.3 & Android <4.1
          box-shadow: $shadow;
}

@mixin form-control-validation($text-color: #555, $border-color: #ccc, $background-color: #f5f5f5) {
  // Color the label and help text
  .help-block,
  .control-label,
  .radio,
  .checkbox,
  .radio-inline,
  .checkbox-inline,
  &.radio label,
  &.checkbox label,
  &.radio-inline label,
  &.checkbox-inline label  {
    color: $text-color;
  }
  // Set the border and box shadow on specific inputs to match
  .form-control {
    border-color: $border-color;
    @include box-shadow(inset 0 1px 1px rgba(0,0,0,.075)); // Redeclare so transitions work
    &:focus {
      border-color: darken($border-color, 10%);
      $shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 6px lighten($border-color, 20%);
      @include box-shadow($shadow);
    }
  }
  // Set validation states also for addons
  .input-group-addon {
    color: $text-color;
    border-color: $border-color;
    background-color: $background-color;
  }
  // Optional feedback icon
  .form-control-feedback {
    color: $text-color;
  }
}

// Feedback states
.has-success {
  @include form-control-validation($state-success-text, $state-success-text, $state-success-bg);
}
.has-warning {
  @include form-control-validation($state-warning-text, $state-warning-text, $state-warning-bg);
}
.has-error {
  @include form-control-validation($state-danger-text, $state-danger-text, $state-danger-bg);
}
```

## Convert Functions

### String Functions

* Conver CSS escapting, i.e. ~"xxx"

Less:
```less
@input-border-focus:             #66afe9;

.box-shadow(@shadow) {
  -webkit-box-shadow: @shadow; // iOS <4.3 & Android <4.1
  box-shadow: @shadow;
}

.form-control-focus(@color: @input-border-focus) {
  @color-rgba: rgba(red(@color), green(@color), blue(@color), .6);
  &:focus {
    border-color: @color;
    outline: 0;
    .box-shadow(~"inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px @{color-rgba}");
  }
}

.form-control {
  .form-control-focus();
}
```

Scss:
```scss
$input-border-focus:             #66afe9;

@mixin box-shadow($shadow) {
  -webkit-box-shadow: $shadow; // iOS <4.3 & Android <4.1
  box-shadow: $shadow;
}

@mixin form-control-focus($color: $input-border-focus) {
  $color-rgba: rgba(red($color), green($color), blue($color), .6);
  &:focus {
    border-color: $color;
    outline: 0;
    @include box-shadow(#{inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px $color-rgba});
  }
}

.form-control {
  @include form-control-focus();
}
```

### Color Functions
* Convert spin() to adjust_hue()

Less:
```less
@state-success-border:           darken(spin(@state-success-bg, -10), 5%);
```

Scss:
```scss
$state-success-border:           darken(adjust_hue($state-success-bg, -10), 5%);
```

## @import At-Rules

Less:
```less
@import "foo";
@import "foo.less";
@import "foo.php";
@import "foo.css";
```

Scss:
```scss
@import "foo";
@import "foo";
@import "foo";
@import "foo.css";
```

## Usage

```js
const postcss = require('postcss')
const syntax = require('postcss-less')
const converter = require('postcss-less2scss')

const lessText = `
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
`
const scssText = postcss([converter])
  .process(lessText, { syntax })
  .css
console.log('lessText = ', lessText, ', \nscssText = ', scssText)
```

### integrate with gulp
```javascript
/**
 * Use postcss-less2scss to convert bootstrap v3.3.7 styles from less to scss
 */
gulp.task('less2scss', () => {
  return gulp.src('assets/less/bootstrap3/**/*.less')
    .pipe(postcss([less2scss], {
      syntax: less
    }))
    .pipe(rename(path => {
      if (path.basename !== 'bootstrap') {
        path.basename = '_' + path.basename
      }
      path.extname = '.scss'
    }))
    .pipe(gulp.dest('build/scss/bootstrap3/'))
})
```
See [PostCSS] docs for examples for your environment.
