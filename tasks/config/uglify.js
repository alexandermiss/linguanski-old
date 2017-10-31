/**
 * `uglify`
 *
 * ---------------------------------------------------------------
 *
 * Minify client-side JavaScript files using UglifyJS.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {

  grunt.config.set('uglify', {
    dist: {
      src: ['.tmp/public/concat/linguanski.js'],
      dest: '.tmp/public/min/linguanski.min.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
