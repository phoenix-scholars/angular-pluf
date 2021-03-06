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
				PGroup, PaginatorPage, PException, PObjectCache, PObjectFactory, PUserMessage,
				$pluf, $rootScope) {
			/*
			 * کاربر جاری را تعیین می‌کند. این متغیر به صورت عمومی در اختیار
			 * کاربران قرار می‌گیرد.
			 */
			var _su = new PUser();

			function setUser(user) {
				_su = user;
				$rootScope.$emit('$userChange', user);
			}

			var _userCache = new PObjectCache(function(data) {
				return new PUser(data);
			});

			var _roleCache = new PObjectCache(function(data) {
				return new PRole(data);
			});

			var _groupCache = new PObjectCache(function(data) {
				return new PGroup(data);
			});

			var _messageCache = new PObjectFactory(function(data) {
				return new PUserMessage(data);
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
						setUser(_userCache.restor(data.id, data));
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
			 *     login : 'user name',
			 *     password : 'password'
			 * }).then(function(user) {
			 *     //Success
			 *     }, function(ex) {
			 * 	//Fail
			 *     });
			 * </code></pre>
			 * 
			 * @memberof $usr
			 * 
			 * @param {object}
			 *                credential پارارمترهای مورد انتظار در احراز اصالت
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
					setUser(_userCache.restor(data.id, data));
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
				}).then(function() {
					setUser(new PUser({}));
					return _su;
				});
			};

			/*
			 * TODO: maso, 1395: دسترسی به موجودیت‌های تکراری است
			 * 
			 * درسترسی به تمام موجودیت‌ها بر اساس مدل جدیدی که در سین معرفی شده
			 * کاملا شبیه به هم هست که تنها چندتا از پارامترهای اون تغییر
			 * می‌کنه. بنابر این بهتر هست که به جای زدن کدهای تکراری یک فکتوری
			 * برای ایجاد این کدها ایجاد کنیم و در زمان اجرا کدها رو کپی کنیم.
			 */

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
			 *                parameter پارامترهای مورد استفاده در صفحه بندی
			 *                نتایج
			 * @return {promise(PaginatorPage)} صفحه‌ای از کاربران سیستم.
			 */
			this.users = $pluf.createFind({
				method : 'GET',
				url : '/api/user/find',
			}, _userCache);

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
			 *                detail خصوصیت‌های کاربر
			 * @return {promise(PUser)} حساب کاربری ایجاد شده
			 */
			this.newUser = $pluf.createNew({
				method : 'POST',
				url : '/api/user/new',
			}, _userCache);

			/**
			 * اطلاعات کاربر را با استفاده از شناسه آن بازیابی می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @param {string}
			 *                id شناسه کاربر مورد نظر
			 * @return {promise(PUser)} اطلاعات بازیابی شده کاربر
			 */
			this.user = $pluf.createGet({
				method : 'GET',
				url : '/api/user/{id}',
			}, _userCache);

			/**
			 * این متد بسته به فیلدهایی که به آن داده می‌شود عملیات زیر را انجام می دهد:
			 * 
			 * <ul>
			 * 	<li>login, callback</li>: ارسال توکن بازیابی پسوورد به ایمیل کاربر
			 * 	<li>email, callback</li>: ارسال توکن بازیابی پسوورد به ایمیل کاربر
			 * 	<li>token, new</li>: تغییر پسوورد کاربر به پسوورد جدید
			 * 	<li>old, new</li>: تغییر پسوورد قبلی به جدید
			 * </ul>
			 * 
			 */
			this.resetPassword = $pluf.post({
				url : '/api/user/password'
			});
			
			/**
			 * فهرست تمام رولهای سیستم را تعیین می‌کند.
			 * 
			 * @param {PaginatorParameter}
			 * @return promise<PaginatedPage<Prole>>
			 */
			this.roles = $pluf.createFind({
				method : 'GET',
				url : '/api/role/find',
			}, _roleCache);

			/**
			 * یک رول با شناسه تعیین شده را برمی‌گرداند
			 * 
			 * @parm {integer} شناسه نقش
			 * @return promise<PRole>
			 */
			this.role = $pluf.createGet({
				method : 'GET',
				url : '/api/role/{id}',
			}, _roleCache);

			/**
			 * یک نقش جدید در سیستم ایجاد می‌کند.
			 * 
			 * @param {Object}
			 *                داده‌های مورد نیاز برای ایجاد یک نقش جدید
			 * @return promise<PRole>
			 */
			this.newRole = $pluf.createNew({
				method : 'POST',
				url : '/api/role/new'
			}, _roleCache);

			/**
			 * فهرست تمام گروه‌ها را تعیین می‌کند.
			 * 
			 * @param {PaginatorParameter}
			 *                پارامترهای صفحه بندی
			 * @return promise<PaginatedPage<PGroup>> فهرست گروه‌ها
			 */
			this.groups = $pluf.createFind({
				method : 'GET',
				url : '/api/group/find',
			}, _groupCache);

			/**
			 * اطلاعات یک گروه را بازیابی می‌کند.
			 * 
			 * @param {integer}
			 *                شناسه گروه
			 * @return {promise<PGroup>} گروه بازیابی شده
			 */
			this.group = $pluf.createGet({
				method : 'GET',
				url : '/api/group/{id}',
			}, _groupCache);

			/**
			 * یک گروه جدید در سیستم ایجاد می‌کند.
			 * 
			 * @param {Object}
			 *                پارامترهای مورد نیاز برای کاربر
			 * @return {promise<PGroup>} گروه ایجاد شده
			 */
			this.newGroup = $pluf.createNew({
				method : 'POST',
				url : '/api/group/new'
			}, _groupCache);

			/**
			 * فهرست تمام پیام‌های کاربر
			 * 
			 * این پیام‌ها توسط سیستم ایجاد می‌شوند و حاوی اطلاعاتی برای کاربر
			 * هستند. ساختار داده‌ای این پیام‌ها ساده و تنها شامل یک متن و تاریخ
			 * می‌شود.
			 * 
			 * @param {PaginatorParameter}
			 *                پارامترهای صفحه بندی
			 * @return {promise<PaginatedPage<Message>>} فهرست پیام‌ها
			 */
			this.messages = $pluf.createFind({
				method : 'GET',
				url : '/api/message/find',
			}, _messageCache);

			/**
			 * پیام تعیین شده را بازیابی می کند.
			 * 
			 */
			this.message = $pluf.createGet({
				method : 'GET',
				url : '/api/message/{id}',
			}, _messageCache);
		});
