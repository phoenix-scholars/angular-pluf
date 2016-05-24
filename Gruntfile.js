module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min',
        mangle: false
      },
      core: {
        src: 'dist/pluf.js',
        dest: 'dist/pluf.min.js'
      }
    },
    jsdoc : {
      all : {
        src: ['src/*/*.js', 'README.md' ],
        options: {
          destination: 'docs',
          configure: 'node_modules/angular-jsdoc/common/conf.json',
          template: 'node_modules/angular-jsdoc/angular-template',
          tutorial: 'tutorials',
        }
      }
    },
    concat: {
      app: {
        src: [ "src/core/*.js" ],
        dest:'dist/pluf.js'
      }
    },
    jshint: {
      'globals': { // Global variables.
        "jasmine": true,
        "angular": true,
        "browser": true,
        "element": true,
        "by":true,
        "io":true,
        "_":false,
        "$":false
      },
      beforeconcat: ['src/core/*.js'],
      afterconcat: ['dist/pluf.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint:beforeconcat', 'concat', 'uglify', 'jshint:afterconcat']);

};
