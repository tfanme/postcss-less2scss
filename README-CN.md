# PostCSS 插件 Less2Scss [![Build Status][ci-img]][ci]

[PostCSS] 将 Less 转换为 Scss 的 PostCSS 插件.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/princetoad/postcss-less2scss.svg
[ci]:      https://travis-ci.org/princetoad/postcss-less2scss

## 转换变量

### 转换变量的定义和使用

* 不属于任何一个 Rule 的变量

Less:
```less
@link-color: #428bca;
```

Scss:
```scss
$link-color: #428bca;
```

* 在某个 Rule 中定义的变量

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

* 在 Declaration 的 value 中使用的变量

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

* 在某个 Rule 中的一个 Declaration 的 value 中使用的变量

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

* 转换 At-Rules 中的变量

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

* 转换选择器中的 variable interpolation

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

## 转换 Mixins

* 转换 Mixins 的定义（可以支持默认参数）

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

* 转换 Mixins 的使用

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

* 支持 Mixins 的具有默认值的参数

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

## 转换函数

### 字符串函数

* 转换 CSS 转义函数，也就是：~"xxx"

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

### 颜色函数
* 将 Less 的 spin() 函数转换为 Scss 的 adjust_hue() 函数

Less:
```less
@state-success-border:           darken(spin(@state-success-bg, -10), 5%);
```

Scss:
```scss
$state-success-border:           darken(adjust_hue($state-success-bg, -10), 5%);
```

## 转换 @import At-Rules

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

## 如果使用 postcss-less2scss 插件

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

### 和 gulp 集成
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
