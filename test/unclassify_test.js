'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.unclassify = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  regular: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/regular.html');
    var expected = grunt.file.read('test/expected/html/regular.html');
    test.equal(actual, expected, 'should remove correct classes.');

    test.done();
  },
  media_query: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/media-query.html');
    var expected = grunt.file.read('test/expected/html/media-query.html');
    test.equal(actual, expected, 'should read classes in media queries.');

    test.done();
  },
  custom_classes: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/custom-classes.html');
    var expected = grunt.file.read('test/expected/html/custom-classes.html');
    test.equal(actual, expected, 'should preserve custom classes.');

    test.done();
  },
  js_classes: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/js-classes.html');
    var expected = grunt.file.read('test/expected/html/js-classes.html');
    test.equal(actual, expected, 'should preserve javascript classes (prefixed with js-*).');

    test.done();
  },
  filter: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/filter.html');
    var expected = grunt.file.read('test/expected/html/filter.html');
    test.equal(actual, expected, 'should preserve classes filtered by function.');

    test.done();
  },
  bootstrap: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/bootstrap.html');
    var expected = grunt.file.read('test/expected/html/bootstrap.html');
    test.equal(actual, expected, 'should preserve bootstrap javascript classes.');

    test.done();
  },
  foundation: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/foundation.html');
    var expected = grunt.file.read('test/expected/html/foundation.html');
    test.equal(actual, expected, 'should preserve foundation javascript classes.');

    test.done();
  },
  html5bp: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html/html5bp.html');
    var expected = grunt.file.read('test/expected/html/html5bp.html');
    test.equal(actual, expected, 'should preserve html5bp javascript classes.');

    test.done();
  },
  single_file: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/html_single/single.html');
    var expected = grunt.file.read('test/expected/html_single/single.html');
    test.equal(actual, expected, 'should process a single file.');

    test.done();
  },
  array_files: function (test) {
    test.expect(2);

    var actualOne = grunt.file.read('test/tmp/html_array/array-1.html');
    var expectedOne = grunt.file.read('test/expected/html_array/array-1.html');
    test.equal(actualOne, expectedOne, 'should process first file of array.');

    var actualTwo = grunt.file.read('test/tmp/html_array/array-2.html');
    var expectedTwo = grunt.file.read('test/expected/html_array/array-2.html');
    test.equal(actualTwo, expectedTwo, 'should process second file of array.');

    test.done();
  },
  multi_files: function (test) {
    test.expect(3);

    var actualOne = grunt.file.read('test/tmp/html_multi/multi-1.html');
    var expectedOne = grunt.file.read('test/expected/html_multi/multi-1.html');
    test.equal(actualOne, expectedOne, 'should process first file of multi.');

    var actualTwo = grunt.file.read('test/tmp/html_multi/multi-2.html');
    var expectedTwo = grunt.file.read('test/expected/html_multi/multi-2.html');
    test.equal(actualTwo, expectedTwo, 'should process second file of multi.');

    var actualThree = grunt.file.read('test/tmp/html_multi/multi-3.html');
    var expectedThree = grunt.file.read('test/expected/html_multi/multi-3.html');
    test.equal(actualThree, expectedThree, 'should process third file of multi.');

    test.done();
  },
  knockout_templates: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/knockout/knockout-template.html');
    var expected = grunt.file.read('test/expected/knockout/knockout-template.html');
    test.equal(actual, expected, 'should process process knockout template correctly.');

    test.done();
  },
  // knockout_bindings: function (test) {
  //   test.expect(1);

  //   var actual = grunt.file.read('test/tmp/knockout/knockout-bindings.html');
  //   var expected = grunt.file.read('test/expected/knockout/knockout-bindings.html');
  //   test.equal(actual, expected, 'should process process knockout bindings correctly.');

  //   test.done();
  // },
  // angular: function (test) {
  //   test.expect(1);

  //   var actual = grunt.file.read('test/tmp/angular/angular.html');
  //   var expected = grunt.file.read('test/expected/angular/angular.html');
  //   test.equal(actual, expected, 'should process process angular templates correctly.');

  //   test.done();
  // },
  django_templates: function (test) {
    test.expect(1);

    var actual = grunt.file.read('test/tmp/django/django-template.html');
    var expected = grunt.file.read('test/expected/django/django-template.html');
    test.equal(actual, expected, 'should process process django template correctly.');

    test.done();
  },
};
