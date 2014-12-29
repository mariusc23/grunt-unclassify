# grunt-unclassify

[![NPM Version](http://img.shields.io/npm/v/grunt-unclassify.svg)](https://www.npmjs.org/package/grunt-unclassify)
[![Circle CI](https://circleci.com/gh/mariusc23/grunt-unclassify.svg?style=shield&circle-token=b800bcfa83e31fb5b5998bf1a6ba9db8af6d7fbe)](https://circleci.com/gh/mariusc23/grunt-unclassify)

> Remove unused css classes in your html.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-unclassify --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-unclassify');
```

## The "unclassify" task

### Overview
In your project's Gruntfile, add a section named `unclassify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  unclassify: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

**NOTE:** This plugin uses [Cheerio](https://github.com/cheeriojs/cheerio) to parse your HTML. Besides removing classes, it may also attempt to fix unclosed/stray tags and other formatting issues.

### Options

#### options.stylesheets
Type: `Array/Path`

An array of paths to stylesheets. You can use file globbing patterns. Valid examples:    
`['path/to/styles.css']` OR `['path/to/**/*.css']`  

#### options.customClasses
Type: `Array/String`    
Default value: `[]`

Array or space-separated list of additional classes to protect (not remove from html).

#### options.jsClasses
Type: `Array/Boolean`    
Default value: `true`

Array of prefixes to protect (not remove). Default of `true` will result in `['js-']`. Setting to `false` will disable it. Use this to preserve classes that are only used by your javascript (and are not in the css).

#### options.bootstrapClasses
Type: `Array/Boolean`    
Default value: `false`

Array of bootstrap javascript classes to protect (not remove). Setting to `true` will result in a default list maintained by this plugin. Last updated for *Bootstrap v3.3.1*.

#### options.foundationClasses
Type: `Array/Boolean`    
Default value: `false`

Array of foundation javascript classes to protect (not remove). Setting to `true` will result in a default list maintained by this plugin. Last updated for *Foundation 5*.

#### options.html5bpClasses
Type: `Array/Boolean`    
Default value: `false`

Array of HTML5 Boilerplate classes to protect (not remove). Setting to `true` will result in a default list maintained by this plugin. Last updated for *HTML5BP v4.3.0*.

#### options.filter
Type: `Function`

Function to protect classes. Classes that were not found in the css will run through this function. Return `true` to keep the class, `false` to remove the class. Parameters provided `(className, classes)`.

#### options.knockout
Type: `Boolean`    
Default value: `false`

Determines whether to search `<script type="text/html">` templates. Does not affect classes in `css:` bindings, yet.

#### options.dry
Type: `Boolean`    
Default value: `false`

Will not write any files. Simulated results will be printed in the terminal. **Highly recommended to run like this first to identify non-css classes.** Classes that are used by javascript but are not in your css will be removed if not accounted for using the options above.

#### options.overwrite
Type: `Boolean`    
Default value: `false`

Files will be overwritten instead of written to dest. Disabled when *options.dry* is `true`.

### Usage Examples

#### Single File

```js
grunt.initConfig({
  unclassify: {
    options: {
      stylesheets: ['assets/css/**/*.css']
    },
    files: {
      'dist/index.html': 'dev/index.html'
    }
  },
})
```

#### Multiple Files

```js
grunt.initConfig({
  unclassify: {
    options: {
      stylesheets: ['assets/css/**/*.css']
    },
    files: {
      'dist/templates/': ['dev/templates/*.html']
    }
  },
})
```

#### Multiple Files (Expand)

```js
grunt.initConfig({
  unclassify: {
    options: {
      stylesheets: ['assets/css/**/*.css']
    },
    files: [{
      expand: true,
      cwd: 'dev/templates',
      src: ['*.html'],
      ext: '.html',
      dest: 'dist/templates/'
    }]
  },
})
```

#### Overwrite Existing Files

```js
grunt.initConfig({
  unclassify: {
    options: {
      stylesheets: ['assets/css/**/*.css'],
      overwrite: true
    },
    src: ['dev/templates/**/*.html']
  },
})
```

#### All options

```js
grunt.initConfig({
  unclassify: {
    options: {
      stylesheets: ['assets/css/**/*.css'],
      customClasses: ['apples', 'bananas'], // array syntax
      jsClasses: ['js-', 'is-'],
      bootstrapClasses: true,
      foundationClasses: true,
      html5bpClasses: 'apples bananas', // string syntax
      filter: function(className, classes) {
        return className === 'keep-me' ? true : false;
      },
      knockout: true,
      dry: true,
      overwrite: true,
    },
    files: [{
      expand: true,
      cwd: 'dev/templates',
      src: ['**/*.html'],
      ext: '.html',
      dest: 'dist/templates/'
    }]
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-12-11   v0.0.5   Do not output file names unless classes were removed.
 * 2014-12-11   v0.0.4   Make console output less verbose.
 * 2014-12-03   v0.0.3   Update readme.  
 * 2014-12-02   v0.0.2   Fix reading classes in media queries.  
 * 2014-12-02   v0.0.1   Initial release.  

## License
Copyright (c) 2014 Marius Craciunoiu. Licensed under the MIT license.
