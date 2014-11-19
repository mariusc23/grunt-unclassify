/*
 * grunt-uncss-html
 * https://github.com/mariusc23/grunt-uncss-html
 *
 * Copyright (c) 2014 Marius Craciunoiu
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    uncss_html: {
      single: {
        options: {
          stylesheets: ['test/fixtures/css/*.css'],
          customClasses: ['first', 'middle']
        },
        // files: [{
        //   src: 'test/fixtures/html/*.html',
        //   dest: 'test/tmp/html/'
        // }]
        files: [{
          expand: true,
          cwd: 'test/fixtures/html/',
          src: ['*.html'],
          ext: '.clean.js',
          dest: 'test/tmp/html/'
        }]
      },
      // custom_options: {
      //   options: {
      //     separator: ': ',
      //     punctuation: ' !!!'
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
      //   }
      // }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'uncss_html', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
