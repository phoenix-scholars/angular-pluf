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

angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $usr
 * 
 * @description یکی از مهم‌ترین سرویس‌هایی است که در این ماژول ارائه می‌شود. این
 *              سرویس موظف است که کاربر جاری را مدیریت کند. علاوه بر این
 *              امکاناتی برای ورود و خروج کاربران نیز فراهم کرده است.
 */
.service(
		'$usr',
		function($http, $httpParamSerializerJQLike, $q, $act, PUser, PRole,
				PGroup, PaginatorPage, PException, PObjectCache) {
			/*
			 * کاربر جاری را تعیین می‌کند. این متغیر به صورت عمومی در اختیار
			 * کاربران قرار می‌گیرد.
			 */
			var _su = new PUser();
			var _userCache = new PObjectCache(function(data) {
				return new PUser(data);
			});

			var _roleCache = new PObjectCache(function(data) {
				return new PRole(data);
			});
			var _groupCache = new PObjectCache(function(data) {
				return new PGroup(data);
			});

			this._userCache = _userCache;
			this._roleCache = _roleCache;
			this._groupCache = _groupCache;

			/**
			 * به صورت همزمان تعیین می‌کند که آیا کاربر جاری شناخته شده است یا
			 * نه. از این فراخوانی در نمایش و یا جایی که باید به صورت همزمان
			 * وضعیت کاربر جاری را تعیین کرده استفاده می‌شود.
			 * 
			 * @memberof $usr
			 * @return {Boolean} درستی در صورتی که کاربر جاری گمنام باشد
			 */
			this.isAnonymous = function() {
				return _su.isAnonymous();
			};

			/**
			 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی
			 * نیز یک فراخوانی هم زمان است و در کارهای نمایشی کاربرد دارد.
			 * 
			 * @memberof $usr
			 * 
			 * @return {Boolean} درستی در صورتی که کاربر جاری مدیر سیستم باشد.
			 */
			this.isAdministrator = function() {
				return _su.isAdministrator();
			};

			/**
			 * کاربری که در نشست تعیین شده است را بازیابی می‌کند. این فراخوانی
			 * که یک فراخوانی غیر همزان است برای تعیین حالت کاربر در سیستم
			 * استفاده می‌شود. برای نمونه ممکن است که یک تابع منجر به خروج کاربر
			 * از سیستم شده باشد، در این حالت این فراخوانی حالت کاربر را بازیابی
			 * کرده و سیستم را به روز می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @returns {promise(PUser)} اطلاعات کاربر جاری
			 */
			this.session = function() {
				if (!this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(_su);
					return deferred.promise;
				}
				return $http.get('/api/user')//
				.then(function(result) {
					if (result.data.id) {
						var data = result.data;
						_su = _userCache.restor(data.id, data);
					}
					return _su;
				});
			};

			/**
			 * عمل ورود کاربر به سیستم را انجام می‌دهد. برای ورود بسته به اینکه
			 * از چه سیستمی استفاده می‌شود پارامترهای متفاوتی مورد نیاز است که
			 * با استفاده از یک ساختار داده‌ای برای این فراخوانی ارسال می‌شود.
			 * برای نمونه در مدل عادی این فراخوانی نیاز به نام کاربری و گذرواژه
			 * دارد که به صورت زیر عمل ورود انجام خواهد شد:
			 * 
			 * <pre><code>
			 * $usr.login({
			 * 	login : 'user name',
			 * 	password : 'password'
			 * }).then(function(user) {
			 * 	//Success
			 * 	}, function(ex) {
			 * 		//Fail
			 * 	});
			 * </code></pre>
			 * 
			 * @memberof $usr
			 * 
			 * @param {object}
			 *            credential پارارمترهای مورد انتظار در احراز اصالت
			 * @return {promise(PUser)} اطلاعات کاربر جاری
			 */
			this.login = function(credit) {
				if (!this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(_su);
					return deferred.promise;
				}
				return $http({
					method : 'POST',
					url : '/api/user/login',
					data : $httpParamSerializerJQLike(credit),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(result) {
					var data = result.data;
					_su = _userCache.restor(data.id, data);
					return _su;
				});
			};

			/**
			 * این فراخوانی عمل خروج کاربری جاری از سیستم را انجام می‌دهد. با
			 * این کار تمام داده‌های کاربر جاری از سیستم حذف شده و سیستم به حالت
			 * اولیه برخواهد گشت.
			 * 
			 * @memberof $usr
			 * 
			 * @returns {promise(PUser)} کاربر جاری که اکنون لاگ‌اوت شده است
			 */
			this.logout = function() {
				if (this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(_su);
					return deferred.promise;
				}
				return $http({
					method : 'POST',
					url : '/api/user/logout',
				}).then(function(result) {
					_su = new PUser(result.data);
					return _su;
				});
			};

			/**
			 * فهرست کاربران را به صورت صفحه بندی شده در اختیار قرار می‌دهد. این
			 * فهرست برای کاربردهای متفاوتی استفاده می‌شود مثل اضافه کردن به
			 * کاربران مجاز. دسترسی به فهرست کاربران تنها بر اساس سطوح امنیتی
			 * تعریف شده در سرور ممکن است و بسته به نوع پیاده سازی سرور متفاوت
			 * خواهد بود.
			 * 
			 * @memberof $usr
			 * 
			 * @param {PagintorParameter}
			 *            parameter پارامترهای مورد استفاده در صفحه بندی نتایج
			 * @return {promise(PaginatorPage)} صفحه‌ای از کاربران سیستم.
			 */
			this.users = function(p) {
				return $http({
					method : 'GET',
					url : '/api/user/find',
					params : p.getParameter()
				}).then(function(res) {
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var item = page.items[i];
						items.push(_userCache(item.id, item));
					}
					page.items = items;
					return page;
				});
			};

			/**
			 * اطلاعات یک کاربر جدید را دریافت کرده و آن را به عنوان یک کاربر در
			 * سیستم ثبت می‌کند. حالت نهایی کاربر به نوع پیاده سازی سرور بستگی
			 * دارد. بر برخی از سرورها، به محض اینکه کاربر ثبت نام کرد حالت فعال
			 * رو داره و می‌تونه وارد سیستم بشه اما در برخی از سیستم‌ها نیاز به
			 * فرآیند فعال سازی دارد.
			 * 
			 * پارامترهای مورد نیاز برای ایجاد کاربر هم متفاوت هست. در برخی
			 * سیستم‌ها ایمیل، نام کاربری و گذرواژه مهم است و سایر پارامترهای به
			 * صورت دلخواه خواهد بود.
			 * 
			 * @memberof $usr
			 * 
			 * @param {object}
			 *            detail خصوصیت‌های کاربر
			 * @return {promise(PUser)} حساب کاربری ایجاد شده
			 */
			this.newUser = function(detail) {
				return $http({
					method : 'POST',
					url : '/api/user/new',
					data : $httpParamSerializerJQLike(detail),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(result) {
					var data = result.data;
					var nu = _userCache.restor(data.id, data);
					return nu;
				});
			};

			/**
			 * اطلاعات کاربر را با استفاده از شناسه آن بازیابی می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @param {string}
			 *            id شناسه کاربر مورد نظر
			 * @return {promise(PUser)} اطلاعات بازیابی شده کاربر
			 */
			this.user = function(id) {
				if (!_userCache.contains(id)) {
					var deferred = $q.defer();
					deferred.resolve(_userCache.get(id));
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/user/' + id,
				}).then(function(result) {
					var data = result.data;
					return _userCache.restor(data.id, data);
				});
			};

			/**
			 * فهرست تمام رولهای سیستم را تعیین می‌کند.
			 * 
			 * @param {PaginatorParameter}
			 * @return promise<PaginatedPage<Prole>>
			 */
			this.roles = function(pagParam) {
				var params = {};
				if (pagParam) {
					params = pagParam.getParameter();
				}
				return $http({
					method : 'GET',
					url : '/api/role/find',
					params : params
				}).then(function(res) {
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var item = page.items[i];
						items.push(_roleCache(item.id, item));
					}
					page.items = items;
					return page;
				});
			};

			/**
			 * یک رول با شناسه تعیین شده را برمی‌گرداند
			 * 
			 * @parm {integer} شناسه نقش
			 * @return promise<PRole>
			 */
			this.role = function(id) {
				if (_roleCache.contains(id)) {
					var deferred = $q.defer();
					deferred.resolve(_roleCache.get(id));
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/role/' + id,
				}).then(function(result) {
					var data = result.data;
					return _roleCache.restor(data.id, data);
				});
			};

			/**
			 * یک نقش جدید در سیستم ایجاد می‌کند.
			 * 
			 * @param {Object}
			 *            داده‌های مورد نیاز برای ایجاد یک نقش جدید
			 * @return promise<PRole>
			 */
			this.newRole = function(detail) {
				return $http({
					method : 'POST',
					url : '/api/role/new',
					data : $httpParamSerializerJQLike(detail),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(result) {
					var data = result.data;
					return _roleCache.restor(data.id, data);
				});
			};

			this.groups = function() {
			};
			this.group = function() {
			};
			this.newGroup = function() {
			};

		});
