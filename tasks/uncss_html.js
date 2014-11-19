/*
 * grunt-uncss-html
 * https://github.com/mariusc23/grunt-uncss-html
 *
 * Copyright (c) 2014 Marius Craciunoiu
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var chalk = require('chalk');
var cheerio = require('cheerio');
var css = require('css');

module.exports = function (grunt) {
  /**
   * Helper to concat stylesheets and parse CSS
   * @param  {Object}  options The grunt options containng stylesheets and separator.
   * @return {Object}
   */
  var parseStyles = function(options, src) {
    var src = grunt.file.expand(src ? src : options.stylesheets);

    var stylesheets = src.filter(function (filepath) {
      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    }).map(function (filepath) {
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf(options.separator));

    // Parse stylesheets
    return css.parse(stylesheets);
  };

  /**
   * Helper to create an array containg all classes found in CSS
   * @param  {Object}  rules          From parseStyles
   * @return {Array}
   */
  var classRegExp = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g; // http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-class-selectors
  var parseClasses = function(rules, ignoredClasses) {
    var classes = [];
    _.forEach(rules, function(rule) {
      _.forEach(rule.selectors, function(selector) {
        var matches = selector.match(classRegExp);
        _.forEach(matches, function(match) {
          classes.push(match.substring(1)); // get rid of .
        });
      });
    });
    return _.uniq(classes);
  };

  /**
   * Helper to check if class is part of classes
   * @param  {String}  className String representing class name
   * @param  {Array}   classes   Array of classes to check against
   * @return {Boolean}
   */
  var classIsValid = _.memoize(function(className, classes) {
    return classes.indexOf(className) !== -1;
  });

  grunt.registerMultiTask('uncss_html', 'Remove unused css classes in your html.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      customClasses: [],
      separator: grunt.util.linefeed
    });

    // Alow string and array input
    if (typeof options.customClasses === 'string') {
      options.customClasses = options.customClasses.split(/\s+/);
    };

    // Generate array of classes
    var classes = options.customClasses.concat(parseClasses(parseStyles(options).stylesheet.rules));

    grunt.log.writeln('Found ' + classes.length + ' classes: ' + chalk.cyan(classes.join(', ')));

    // Stats
    var stats = {
      removed: 0,
      untouched: 0,
      all: 0
    };

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      _.forEach(file.src, function(fileSrc) {
        grunt.log.writeln(chalk.underline(fileSrc));

        // File Stats
        var fileTotal = {
          removed: 0,
          untouched: 0,
          all: 0
        };

        // Generate cheerio fake DOM object
        var $ = cheerio.load(grunt.file.read(fileSrc), { decodeEntities: false });

        // For each element that has a class
        $('[class]').each(function(i, element) {
          var el = $(this);

          // List all classes for element
          var elClasses = el[0].attribs.class.split(/\s+/);

          // List of classes to remove
          var removeClasses = [];

          // List of remaining classes
          var resultClasses = [];

          // Check each class
          _.forEach(elClasses, function(elClass) {
            if (!classIsValid(elClass, classes)) {
              removeClasses.push(elClass);
              fileTotal.removed++;
              stats.removed++;
            } else {
              resultClasses.push(elClass);
              fileTotal.untouched++;
              stats.untouched++;
            };
            fileTotal.all++;
            stats.all++;
          });

          // Remove classes
          el.removeClass(removeClasses.join(' '));

          // Log output
          if (removeClasses.length) {
            grunt.log.writeln(chalk.gray([
              '[', chalk.red(removeClasses.length), ', ', chalk.green(resultClasses.length) + '] ',
              el[0].name,
              ' .',
              elClasses.join(' .'),
              ' - ',
              chalk.red(removeClasses.join(' ')),
              resultClasses.length ? ' == ' : '',
              chalk.green(resultClasses.join(' '))
            ].join('')));
          };

        });

        if (fileTotal.removed === 0) {
          grunt.log.writeln(chalk.gray('No classes removed.'));
          grunt.log.writeln();
        } else {
          grunt.log.writeln(chalk.gray('Removed ' + chalk.red(fileTotal.removed) + ' out of ' + chalk.blue(fileTotal.all) + ' classes.'));
          grunt.log.writeln();
        };

        // Remove empty attributes
        $('[class=""]').removeAttr('class');

        console.log(fileSrc);
        console.log(file.dest);

        // grunt.log.writeln($.html());
        // grunt.log.writeln(chalk.red($('.first').outerHtml()));
        // grunt.file.write(fileSrc, result);
      });

      // Write the destination file.
      // grunt.file.write(file.dest, src);

      // Print a success message.
      // grunt.log.writeln('File "' + file.dest + '" created.');
    });

    if (stats.removed === 0) {
      grunt.log.writeln(chalk.gray('[TOTAL] No classes removed.'));
    } else {
      grunt.log.writeln(chalk.bgYellow.black.bold('[TOTAL] Removed ' + stats.removed + ' out of ' + stats.all + ' classes.'));
    };
  });

};
