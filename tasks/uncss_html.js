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
    src = grunt.file.expand(src ? src : options.stylesheets);

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
        // TODO: deal with handlebars
        var matches = getMatchingClasses(selector);
        _.forEach(matches, function(match) {
          classes.push(match.substring(1)); // get rid of .
        });
      });
    });
    return _.uniq(classes);
  };

  var getMatchingClasses = _.memoize(function(selector) {
    return selector.match(classRegExp);
  });

  /**
   * Helper to check if class is part of classes
   * @param  {String}  className String representing class name
   * @param  {Array}   classes   Array of classes to check against
   * @return {Boolean}
   */
  var classIsValid = _.memoize(function(className, classes) {
    return classes.indexOf(className) !== -1;
  });

  /**
   * Helper to check if class is a js-class (js-*)
   * @param  {String}  className String representing class name
   * @return {Boolean}
   */
  var isJsClass = _.memoize(function(className, prefixes) {
    if (prefixes === true) {
      prefixes = ['js-'];
    }
    for (var i = 0; i < prefixes.length; i++) {
      if (className.substring(0, prefixes[i].length) === prefixes[i]) {
        return true;
      }
    }
    return false;
  });

  grunt.registerMultiTask('uncss_html', 'Remove unused css classes in your html.', function () {
    var that = this;

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      stylesheets: [],
      customClasses: [],
      jsClasses: true,
      bootstrapClasses: false,
      foundationClasses: false,
      html5bpClasses: false,
      // filter: function() { return false; },
      separator: grunt.util.linefeed,
      overwrite: false,
      dry: false
    });

    // Alow string and array input
    if (typeof options.customClasses === 'string') {
      options.customClasses = options.customClasses.split(/\s+/);
    }

    if (typeof options.bootstrapClasses === 'string') {
      options.bootstrapClasses = options.bootstrapClasses.split(/\s+/);
    } else if (options.bootstrapClasses === true) {
      options.bootstrapClasses = ['active', 'affix', 'affix-bottom', 'affix-top', 'arrow', 'bottom', 'btn', 'carousel', 'carousel-indicators', 'collapse', 'collapsed', 'collapsing', 'disabled', 'divider', 'dropdown', 'dropdown-backdrop', 'dropdown-menu', 'fade', 'height', 'hidden', 'in', 'left', 'modal', 'modal-backdrop', 'modal-content', 'modal-dialog', 'modal-open', 'modal-scrollbar-measure', 'navbar', 'navbar-nav', 'open', 'out', 'panel', 'popover', 'popover-content', 'popover-title', 'right', 'slide', 'tooltip', 'tooltip-arrow', 'tooltip-inner', 'top', 'width'];
    }

    if (typeof options.foundationClasses === 'string') {
      options.foundationClasses = options.foundationClasses.split(/\s+/);
    } else if (options.foundationClasses === true) {
      options.foundationClasses = ['abide', 'accordion', 'accordion-navigation', 'active', 'alert', 'alert-close', 'back', 'bottom', 'carousel', 'clearing', 'clearing-assembled', 'clearing-blackout', 'clearing-caption', 'clearing-close', 'clearing-container', 'clearing-main-next', 'clearing-main-prev', 'clearing-touch-label', 'close-reveal-modal', 'content', 'disabled', 'drop-bottom', 'drop-left', 'drop-right', 'drop-top', 'dropdown', 'dropdown-content', 'error', 'exit-off-canvas', 'expanded', 'f-topbar-fixed', 'fix-height', 'fixed', 'has-submenu', 'interchange', 'joyride', 'joyride-close-tip', 'joyride-content-wrapper', 'joyride-expose-cover', 'joyride-expose-wrapper', 'joyride-modal-bg', 'joyride-next-tip', 'joyride-prev-tip', 'joyride-timer-indicator', 'joyride-timer-indicator-wrap', 'joyride-tip-guide', 'large', 'left', 'left-off-canvas-menu', 'left-off-canvas-toggle', 'left-submenu', 'magellan', 'medium', 'mega', 'move-left', 'move-right', 'moved', 'next', 'off-canvas-wrap', 'offcanva-overlap-left', 'offcanvas', 'offcanvas-overlap', 'offcanvas-overlap-right', 'open', 'orbit', 'orbit-bullets', 'orbit-caption', 'orbit-next', 'orbit-prev', 'orbit-progress', 'orbit-slide-number', 'orbit-slides-container', 'orbit-stack-on-small', 'orbit-timer', 'orbit-transitioning', 'paused', 'preloader', 'range-slider-active-segment', 'range-slider-handle', 'reveal', 'reveal-modal-bg', 'right', 'right-off-canvas-menu', 'right-off-canvas-toggle', 'right-submenu', 'scroll-container', 'slider', 'small', 'sticky', 'tab', 'tabs-content', 'tap-to-close', 'title', 'toggle-topbar', 'tooltip', 'top', 'top-bar-section', 'topbar', 'visible', 'visible-img'];
    }

    if (typeof options.html5bpClasses === 'string') {
      options.html5bpClasses = options.html5bpClasses.split(/\s+/);
    } else if (options.html5bpClasses === true) {
      options.html5bpClasses = ['browserupgrade', 'clearfix', 'focusable', 'invisible', 'no-js', 'visuallyhidden'];
    }

    // Generate array of classes
    var classes = parseClasses(parseStyles(options).stylesheet.rules);

    if (Array.isArray(options.customClasses)) {
      classes = classes.concat(options.customClasses);
    }

    if (Array.isArray(options.bootstrapClasses)) {
      classes = classes.concat(options.bootstrapClasses);
    }

    if (Array.isArray(options.foundationClasses)) {
      classes = classes.concat(options.foundationClasses);
    }

    if (Array.isArray(options.html5bpClasses)) {
      classes = classes.concat(options.html5bpClasses);
    }

    if (Array.isArray(options.bootstrapClasses) || Array.isArray(options.foundationClasses) || Array.isArray(options.html5bpClasses)) {
      classes = _.uniq(classes);
    }

    grunt.log.writeln('Found ' + classes.length + ' classes: ' + chalk.cyan(classes.join(', ')));

    // Grand Total
    var stats = {
      removed: 0,
      untouched: 0,
      all: 0
    };

    console.log(this.files);

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      _.forEach(file.src, function(fileSrc) {
        grunt.log.writeln(chalk.underline(fileSrc));

        console.log(fileSrc);
        console.log(file.dest);

        // File Stats
        var fileTotal = {
          removed: 0,
          untouched: 0,
          all: 0
        };

        // Generate cheerio (fake DOM object)
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

          _.forEach(elClasses, function(elClass) {
            // Check if class exists and it passes optional filter
            if (!classIsValid(elClass, classes) &&
                (!options.filter || options.filter.call(that, elClass, classes) === false) &&
                (!options.jsClasses || !isJsClass(elClass, options.jsClasses))) {
              removeClasses.push(elClass);
              fileTotal.removed++;
              stats.removed++;
            } else {
              resultClasses.push(elClass);
              fileTotal.untouched++;
              stats.untouched++;
            }
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
          }

        });

        if (fileTotal.removed === 0) {
          grunt.log.writeln(chalk.gray('No classes removed.'));
          grunt.log.writeln();
        } else {
          grunt.log.writeln(chalk.gray('Removed ' + chalk.red(fileTotal.removed) + ' out of ' + chalk.blue(fileTotal.all) + ' classes.'));
          grunt.log.writeln();
        }

        // Remove empty attributes
        $('[class=""]').removeAttr('class');

        if (!options.dry) {
          if (options.overwrite) {
            grunt.file.write(fileSrc, $.html());
          } else {
            console.log(fileSrc.replace(/^.*[\\\/]/, ''));
            grunt.file.write(file.dest, $.html());
          }
        }
      });
    });

    if (stats.removed === 0) {
      grunt.log.writeln(chalk.bgYellow.black.bold('[TOTAL] No classes removed.'));
    } else {
      grunt.log.writeln(chalk.bgYellow.black.bold('[TOTAL] Removed ' + stats.removed + ' out of ' + stats.all + ' classes.'));
    }

    if (options.dry) {
      grunt.log.writeln(chalk.bgRed.white('DRY mode on. No files written.'));
    }
  });

};
