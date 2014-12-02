/*
 * grunt-unclassify
 * https://github.com/mariusc23/grunt-unclassify
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
    unclassify: {
      all_classes: {
        options: {
          stylesheets: ['test/fixtures/css/*.css']
        },
        src: ['test/fixtures/html/regular.html'],
        dest: 'test/tmp/html/regular.html'
      },

      media: {
        options: {
          stylesheets: ['test/fixtures/css/media-query.css']
        },
        files: {
          'test/tmp/html/media-query.html': ['test/fixtures/html/media-query.html']
        }
      },

      custom: {
        options: {
          customClasses: ['custom']
        },
        files: {
          'test/tmp/html/custom-classes.html': ['test/fixtures/html/custom-classes.html']
        }
      },

      js: {
        options: {
          jsClasses: true
        },
        files: {
          'test/tmp/html/js-classes.html': ['test/fixtures/html/js-classes.html']
        }
      },

      filter: {
        options: {
          filter: function(className, classes) {
            return className === 'filter' ? true : false;
          }
        },
        files: {
          'test/tmp/html/filter.html': ['test/fixtures/html/filter.html']
        }
      },

      bootstrap: {
        options: {
          bootstrapClasses: true
        },
        files: {
          'test/tmp/html/bootstrap.html': ['test/fixtures/html/bootstrap.html']
        }
      },

      foundation: {
        options: {
          foundationClasses: true
        },
        files: {
          'test/tmp/html/foundation.html': ['test/fixtures/html/foundation.html']
        }
      },

      html5bp: {
        options: {
          html5bp: true
        },
        files: {
          'test/tmp/html/html5bp.html': ['test/fixtures/html/html5bp.html']
        }
      },

      overwrite: {
        options: {
          dry: true
        },
        src: ['test/fixtures/html_array/*.html']
      },

      single_file: {
        options: {
          stylesheets: ['test/fixtures/css/*.css']
        },
        files: {
          'test/tmp/html_single/single.html': 'test/fixtures/html_single/single.html'
        }
      },

      array_files: {
        options: {
          stylesheets: ['test/fixtures/css/*.css']
        },
        files: {
          'test/tmp/html_array/': ['test/fixtures/html_array/*.html']
        }
      },

      multi_files: {
        options: {
          stylesheets: ['test/fixtures/css/*.css']
        },
        files: [{
          expand: true,
          cwd: 'test/fixtures/html_multi',
          src: ['*.html'],
          ext: '.html',
          dest: 'test/tmp/html_multi/'
        }]
      },

      angular: {
        options: {
          stylesheets: ['test/fixtures/css/*.css'],
          knockout: true
        },
        files: {
          'test/tmp/angular/': ['test/fixtures/angular/*.html']
        }
      },

      knockout: {
        options: {
          stylesheets: ['test/fixtures/css/*.css'],
          knockout: true
        },
        files: {
          'test/tmp/knockout/': ['test/fixtures/knockout/knockout-template.html', 'test/fixtures/knockout/knockout-bindings.html']
        }
      },

      django: {
        options: {
          stylesheets: ['test/fixtures/css/*.css']
        },
        files: {
          'test/tmp/django/': ['test/fixtures/django/django-template.html']
        }
      },
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
  grunt.registerTask('test', ['clean', 'unclassify', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
