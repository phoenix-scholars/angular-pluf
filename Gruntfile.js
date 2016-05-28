module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min',
        mangle: false,
      },
      core: {
        src: 'dist/pluf.js',
        dest: 'dist/pluf.min.js',
      },
    },
    jsdoc: {
      all: {
        src: ['src/*/*.js'],
        options: {
          destination: 'doc/jsdoc',
          configure: 'node_modules/angular-jsdoc/common/conf.json',
          template: 'node_modules/angular-jsdoc/angular-template',
          tutorial: 'doc/tutorials',
          readme: 'README.md'
        },
      },
    },
    concat: {
      core: {
        src: [
          'src/core.js',
          'src/core/*.js',
        ],
        dest: 'dist/pluf.js',
      },
      wiki: {
        src: ['src/wiki.js', 'src/wiki/*.js'],
        dest: 'dist/pluf.wiki.js',
      },
      saas: {
        src: ['src/saas.js', 'src/saas/*.js'],
        dest: 'dist/pluf.saas.js',
      },
      social: {
        src: ['src/social.js', 'src/social/*.js'],
        dest: 'dist/pluf.social.js',
      },
    },
    jshint: {
      globals: { // Global variables.
        jasmine: true,
        angular: true,
        browser: true,
        element: true,
        by: true,
        io: true,
        _: false,
        $: false,
      },
      beforeconcat: [
        'src/*.js',
        'src/*/*.js',
      ],
      afterconcat: [
        'dist/pluf.js',
        'dist/pluf.wiki.js',
        'dist/pluf.saas.js',
        'dist/pluf.social.js',
      ],
    },
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/**/*.js',
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', [
    'jshint:beforeconcat',
    'concat',
    'jshint:afterconcat',
    'uglify',
    'jsdoc',
  ]);

};
