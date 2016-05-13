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
        src: 'src/pluf.js',
        dest: 'dest/pluf.min.js'
      },
      admin: {
        src: 'src/pluf.admin.js',
        dest: 'dest/pluf.admin.min.js'
      },
      help: {
        src: 'src/pluf.help.js',
        dest: 'dest/pluf.help.min.js'
      },
      hm: {
        src: 'src/pluf.hm.js',
        dest: 'dest/pluf.hm.min.js'
      },
      jayab: {
        src: 'src/pluf.jayab.js',
        dest: 'dest/pluf.jayab.min.js'
      },
      news: {
        src: 'src/pluf.news.js',
        dest: 'dest/pluf.news.min.js'
      },
      saas: {
        src: 'src/pluf.saas.js',
        dest: 'dest/pluf.saas.min.js'
      },
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
