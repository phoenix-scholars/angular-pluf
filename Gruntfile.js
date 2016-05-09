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
      pluf: {
        src: 'src/pluf.js',
        dest: 'dest/pluf.min.js'
      }
    },
    jsdoc : {
      all : {
        src: ['src/*.js', 'README.md' ],
        options: {
          destination: 'docs',
          configure: 'node_modules/angular-jsdoc/common/conf.json',
          template: 'node_modules/angular-jsdoc/angular-template',
          tutorial: 'tutorials',
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'jsdoc']);

};
