/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	/*
	 * به صورت خودکار تمام افزونه‌های مورد نیاز بار گذاری می‌شود. در صورتی که
	 * این افزونه‌ها نامگذاری grunt را رعایت نمی‌کنند باید نام وظایف آنها نیز
	 * تعیین شود.
	 */
	require('jit-grunt')(grunt, {
		useminPrepare : 'grunt-usemin',
		ngtemplates : 'grunt-angular-templates'
	});

	/*
	 * تنظیم‌های کلی بسته را ایجاد می‌کند. این تنظیم‌ها بر اساس خصوصیت‌های تعیین
	 * شده در پرونده bower.json تعیین می‌شود.
	 */
	var appConfig = {
		app : require('./bower.json').srcPath || 'src',
		dist : 'dist',
		pkg : require('./bower.json')
	};

	// Define the configuration for all the tasks
	grunt
			.initConfig({

				/*
				 * تنظیم‌های پروژه: تمام تنظیم‌هایی که در وظایف استفاده می‌شود
				 * بر اساس این متغیر است.
				 */
				yeoman : appConfig,

				/*
				 * اجرای تست ایستا روی تمام سروس‌های ایجاد شده . با این کار
				 * مطمئن می‌شیم که خطای نحوی در برنامه‌ها وجود نداره. برای این
				 * کار از تست‌های ایستای jshint استفاده می‌کنیم. این برنامه
				 * می‌تونه پرنده‌های js رو دریافت و تحلیل کنه. توضیحات بیشتر در
				 * مورد این برنامه رو در مسیر زیر ببینید:
				 * 
				 * http://jshint.com
				 * 
				 * نکته: ما فرض کردیم که تمام کدها در پوشه اصلی و یک زیر پوشه
				 * دیگر نوشته می شود در صورتی که سلسله مراتب پوشه‌ها بیشتر از
				 * این شد باید این تنظیم‌ها تغییر کند.
				 * 
				 * تنظیم‌های به کار رفته در این پردازش در فایل .jshintrc وجود
				 * دارد و شما می‌توانید در صورت نیاز این تنظیم‌ها را تغییر دهید.
				 * 
				 * برای استفاده از این تست در محیط grunt از بسته
				 * grunt-contrib-jshint استفاده شده است که به صورت خودکار و بر
				 * اساس تنظیم‌های موجود این نوع تست را روی تمام کدهای موجود در
				 * نرم افزار اجرا می‌کند. برای اطلاعات بیشتر در مورد این افزونه
				 * به آدرس زیر مراجعه کنید:
				 * 
				 * https://github.com/gruntjs/grunt-contrib-jshint
				 * 
				 * برای اینکه نتیجه‌های تولید شده بر اساس این تست خوب نمایش داده
				 * بشه از یک افزونه دیگه به نام jshint-stylish استفاده شده است.
				 * البته شما می‌تونید از روش‌های دیگه‌ای برای تولید گزارش
				 * استفاده کنید. برای اطلاع بیشتر در این زمینه پیوند زیر رو
				 * ببینید:
				 * 
				 * http://jshint.com/docs/reporters/
				 * 
				 * 
				 */
				jshint : {
					options : {
						jshintrc : '.jshintrc',
						reporter : require('jshint-stylish')
					},
					all : {
						src : [ 'Gruntfile.js', '<%= yeoman.app %>/{,*/}*.js' ]
					},
					test : {
						options : {
							jshintrc : 'test/.jshintrc'
						},
						src : [ 'test/spec/{,*/}*.js' ]
					}
				},

				/*
				 * استایل کدها رو بررسی می‌کنه تا مطمئن بشیم که کدها خوش فرم
				 * نوشته شده اند. این یک نمونه تست هست که توش به نحوه نگارش کدها
				 * توجه می‌کنه. برای این کار از یک بسته به نام jscs استفاده شده
				 * است. برای کسب اطلاع بیشتر در مورد این بسته پیونده زیر رو
				 * ببینید:
				 * 
				 * http://jscs.info/
				 * 
				 * این برنامه رو با استفاده از افزونه grunt-jscs اجرا می‌کنیم.
				 * این افزونه امکان چک کردن تمام کدهای نوشته شده رو می‌ده.
				 * اطلاعات بیشتر در مورد این افزونه در مسییر زیر وجود داره:
				 * 
				 * https://github.com/jscs-dev/grunt-jscs
				 * 
				 * برای این بسته هم یه سری تنظیم‌ها در نظر گرفته شده که تو فایل
				 * .jscsrc وجود داره در صورت تمایل می‌تونید این تنظیم‌ها رو بر
				 * اساس نیازهای خودتون به روز کنید.
				 */
				jscs : {
					options : {
						config : '.jscsrc',
						verbose : true
					},
					all : {
						src : [ 'Gruntfile.js', '<%= yeoman.app %>/{,*/}*.js' ]
					},
					test : {
						src : [ 'test/spec/{,*/}*.js' ]
					}
				},

				/*
				 * یکی از کارهایی که در تولید نهایی
				 */
				jsdoc : {
					all : {
						src : [ '<%= yeoman.app %>/{,*/}*.js' ],
						options : {
							destination : '<%= yeoman.dist %>/doc/jsdoc',
							configure : 'node_modules/angular-jsdoc/common/conf.json',
							template : 'node_modules/angular-jsdoc/angular-template',
							tutorial : 'doc/tutorials',
							readme : 'README.md'
						},
					},
				},

				/*
				 * مسیرها و داده‌های موقت را حذف می‌کند تا شرایط برای اجرای
				 * دوباره مراحل ساخت آماده شود. خیلی از این فایل‌ها به عنوان
				 * محصول و یا مستند ایجاد می‌شن و باید اونها رو قبل از هر بار
				 * تولید نسخه جدید حذف کنیم. پاک کردن با استفاده از این ماژول
				 * انجام می‌شه. اطلاعات بشتر رو از پیوند زیر مطالعه کنید:
				 * 
				 * https://github.com/gruntjs/grunt-contrib-clean
				 * 
				 * تمام پرونده‌هایی که در مسیر .tmp و یا مسیر محصول نهایی ایجاد
				 * می‌شن به عنوان پرنده‌های اضافه در نظر گرفته می‌شوند و به صورت
				 * خودکار حذف می‌شوند.
				 */
				clean : {
					dist : {
						files : [ {
							dot : true,
							src : [ '.tmp', '<%= yeoman.dist %>/{,*/}*',
									'!<%= yeoman.dist %>/.git{,*/}*' ]
						} ]
					}
				},

				/*
				 * تمام وابستگی‌هایی که با استفاده از مدیریت بسته‌های bower نصب
				 * می‌شود شامل فایلهای هست که باید توی برنامه‌ها اضافه بشه. این
				 * کار رو می‌شه به صورت خودکار انجام داد. بسته wiredep توی
				 * بخشه‌های متفاوتی از برنامه می‌تونه این وابستگی‌های جدید رو
				 * تزریق کنه و شما رو از انجام این کار بی نیاز کنه. برای اطلاع
				 * بیشتر در مورد این افزونه پیونده زیر رو ببیندی:
				 *  ؟؟
				 * 
				 * این کار روش ساده‌ای داره، یه الگو پیدا می‌شه و بعد وسط اون
				 * الگو با فهرست فایلهایی وابستگی‌ها پر می‌شه.
				 */
				wiredep : {
					// app: {
					// src: ['<%= yeoman.app %>/index.html'],
					// ignorePath: /\.\.\//
					// },
					test : {
						devDependencies : true,
						src : '<%= karma.unit.configFile %>',
						ignorePath : /\.\.\//,
						fileTypes : {
							js : {
								block : /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
								detect : {
									js : /'(.*\.js)'/gi
								},
								replace : {
									js : '\'{{filePath}}\','
								}
							}
						}
					}
				},

				// The following *-min tasks will produce minified files in the
				// dist folder
				// By default, your `index.html`'s <!-- Usemin block --> will
				// take care of
				// minification. These next options are pre-configured if you do
				// not wish
				// to use the Usemin blocks.
				uglify : {
					dist : {
						files : {
							'<%= yeoman.dist %>/<%= yeoman.pkg.name %>.min.js' : [ '.tmp/{,*/}*.js' ]
						}
					}
				},

				/*
				 * کتابخونه‌ها از مجموعه‌ای از پرونده‌های اسکریپتی تشکیل شدن که
				 * در نهایت باید با هم ترکیب بشن و به صورت یک پرونده یکتا ذخیره
				 * بشن. این کار با استفاده از افزونه concat انجام می‌شه. اطلاعات
				 * بیشتر در این مورد تو مسیر زیر وجود داره:
				 * 
				 * https://github.com/gruntjs/grunt-contrib-concat
				 * 
				 * ما تمام فایلها رو سر هم می‌زنیم و دوتا پرونده ایجاد می‌کنیم،
				 * یکی مستقیم به عنوان محصول ارائه می‌شه ولی یکی تو پوشه موقت
				 * ایجاد می‌شه تا بتونیم کارهای دیگه‌ای روش انجام بدیم.
				 */
				concat : {
					tmp : {
						src : [ '<%= yeoman.app %>/*.js',
								'<%= yeoman.app %>/*/*.js' ],
						dest : '.tmp/<%= yeoman.pkg.name %>.js'
					},
					dist : {
						src : [ '<%= yeoman.app %>/*.js',
								'<%= yeoman.app %>/*/*.js' ],
						dest : '<%= yeoman.dist %>/<%= yeoman.pkg.name %>.js'
					}
				},

				/*
				 * الگوهای متفاوتی در یک بسته طراحی می‌شه اما باید این الگوها رو
				 * بزنیم سر هم و حجمش رو کم کنی تا به یک کتابخونه مناسب برسیم.
				 * یکی از ابزارهایی که می‌تونه الگوهای ایجاد شده برای انگولار رو
				 * مدیریت کن بسته ngtemplates هست. برای اطلاع بیشتر در مورد این
				 * بسته پیوند زیر رو ببینید:
				 * 
				 * https://github.com/ericclemmons/grunt-angular-templates
				 * 
				 * این بسته رو می‌تونیم با سایر بسته‌ها ترکیب کنیم.
				 */
				// ngtemplates: {
				// dist: {
				// options: {
				// module: 'ngDigiDoci',
				// // htmlmin: '<%= htmlmin.dist.options %>',
				// usemin: '<%= yeoman.pkg.name %>.js'
				// },
				// cwd: '<%= yeoman.app %>',
				// src: 'views/{,*/}*.html',
				// dest: '.tmp/templateCache.js'
				// }
				// },
				/*
				 * یکی از مشکلاتی که داریم دزدی کدها است و این جایی سخت تر می‌شه
				 * که نمی‌شه به سادگی کدهای انگولار رو به هم ریخت. البته توی
				 * بسته انگولار راهکارهایی برای این منظور در نظر گرفته شده. با
				 * استفاده از افزونه ngAnnotate ما ساختار کد رو تغییر می‌دیم و
				 * در نهایت به یک مدلی تبدیل می‌کنیم که بشه بهمش ریخت. برای
				 * اطلاع بیشتر در این زمینه یپوند زیر رو مشاهد کنید:
				 * 
				 * https://github.com/mgol/grunt-ng-annotate
				 * 
				 * این کار روی پرونده‌هایی انجام می‌شه که توی مسیر .tmp ایجاد
				 * شده اند و همگی پرونده‌های موقت هستن. به این ترتیب می‌تونیم
				 * تمام پرونده‌های موجود در این مسیر رو کامل به هم بریزیم.
				 */
				ngAnnotate : {
					dist : {
						files : [ {
							expand : true,
							cwd : '.tmp/',
							src : '*.js',
							dest : '.tmp/'
						} ]
					}
				},

				// Copies remaining files to places other tasks can use
				copy : {
					// dist: {
					// files: [{
					// expand: true,
					// dot: true,
					// cwd: '<%= yeoman.app %>',
					// dest: '<%= yeoman.dist %>',
					// src: [
					// '*.{ico,png,txt}',
					// '*.html',
					// 'images/{,*/}*.{webp}',
					// 'styles/fonts/{,*/}*.*'
					// ]
					// }, {
					// expand: true,
					// cwd: '.tmp/images',
					// dest: '<%= yeoman.dist %>/images',
					// src: ['generated/*']
					// }]
					// },
					styles : {
						expand : true,
						cwd : '<%= yeoman.app %>/styles',
						dest : '.tmp/styles/',
						src : '{,*/}*.css'
					}
				},

				// // Run some tasks in parallel to speed up the build process
				// concurrent: {
				// server: [
				// 'copy:styles'
				// ],
				// test: [
				// 'copy:styles'
				// ],
				// dist: [
				// 'copy:styles',
				// 'imagemin',
				// 'svgmin'
				// ]
				// },

				/*
				 * اجرای تست‌ها با بسته karma هست.
				 * 
				 * https://github.com/karma-runner/grunt-karma
				 * 
				 * مدلهای متفاوتی می‌شه تست‌ها رو اجرا کرد. در صورتی که بخواهید
				 * کدها رو روی یک کاوشگر خاص به صورت رفع خطا اجرا کنید پیوند زیر
				 * اطالعات خوبی برای این کار ارائه کرده است:
				 * 
				 * http://bahmutov.calepin.co/debugging-karma-unit-tests.html
				 * 
				 */
				karma : {
					unit : {
						configFile : 'test/karma.conf.js',
						singleRun : true
					},
					debug : {
						configFile : 'test/karma.conf.js',
						port : 9999,
						singleRun : false,
						browsers : [ 'Chrome' ]
					}
				},
			});

	grunt.registerTask('test', [ 'clean', 'wiredep', 'karma:unit' ]);

	grunt.registerTask('debug', [ 'clean', 'wiredep', 'karma:debug' ]);

	grunt.registerTask('build', [ 'clean:dist', 'wiredep',
	// 'ngtemplates',
	'concat', 'ngAnnotate',
	// 'copy:dist',
	// 'cdnify',
	'uglify'
	// 'usemin'
	]);

	grunt.registerTask('default', [ 'concat', 'newer:jshint', 'newer:jscs',
			'test', 'build' ]);
};
