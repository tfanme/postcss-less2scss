# PostCSS Less2scss [![Build Status][ci-img]][ci]

[PostCSS] plugin to convert Less to SCSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/princetoad/postcss-less2scss.svg
[ci]:      https://travis-ci.org/princetoad/postcss-less2scss

## Variables

### Overview

* Variables - Declaration outof any rules

```css
    @link-color: #428bca;
```

```css
    $link-color: #428bca;
```

* Variables - Declaration in nested rules
```css
    #main {
      @width: 5em;
      width: @width;
    }
```

```css
    #main {
      $width: 5em;
      width: $width;
    }
```

* Variables - Reference as a single value or part of a value
```css
    @text-color: @gray-dark;
    @link-color-hover:  darken(@link-color, 10%);
```

```css
    $text-color: $gray-dark;
    $link-color-hover:  darken($link-color, 10%);
```

* Variables - Reference as a single value or part of a value in nested rules
```css
    a:hover {
      color: @link-color-hover;
    }
```

```css
    a:hover {
      color: $link-color-hover;
    }
```

### Variable Interpolation
TODO

## Usage

```js
postcss([ require('postcss-less2scss') ])
```

See [PostCSS] docs for examples for your environment.
