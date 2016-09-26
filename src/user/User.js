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
 * @ngdoc factory
 * @name PUser
 * @memberof pluf
 * 
 * @description ساختار داده‌ای یک کاربر را در سیستم تعیین می‌کند. از این مدل
 *              برای مدیریت کردن اطلاعات کاربری استفاده می‌شود.
 * 
 * @attr {Integer} id شناسه
 * @attr {String} login نام کاربری به منظور لاگین کردن
 * @attr {String} password کلمه عبور کاربر برای لاگین کردن
 * @attr {String} first_name نام کاربر
 * @attr {String} last_name نام خانوادگی کاربر
 * @attr {String} email آدرس ایمیل کاربر
 * @attr {String} language زبان پیش‌فرض کاربر
 * @attr {String} timezone منطقه زمانی کاربر
 * @attr {Datetime} date_joined تاریخ و زمان ایجاد حساب
 * @attr {Datetime} last_login تاریخ و زمان آخرین لاگین
 * @attr {Boolean} administrator تعیین می‌کند که آیا این کاربر دسترسی ادمین دارد
 *       یا نه
 * @attr {Boolean} staff تعیین می‌کند که این کاربر دسترسی staff دارد یا نه
 * 
 * @attr {String} avatar مسیر اواتار رو تعیین می‌کنه و به صورت پویا ایجاد می‌شه.
 *       فرض این هست که شناسه کاربر در حین کار تغییر نمی‌کنه
 * 
 * از این موجودیت برای مدیریت (ایجاد، ویرایش و حذف) حساب کاربری استفاده می‌شود.
 * برای نمونه فرض کنید که می‌خواهیم نام یک کاربر را تغییر دهیم، برای این کار کد
 * زیر باید استفاده شود:
 * 
 * <pre><code>
 * 	var user;
 * 	...
 * 	user.first_name = 'new first name';
 * 	user.update().then(function(){
 * 		// user account is updated
 * 	});
 * </code></pre>
 * 
 * نکته: در صورتی که خصوصیت گذرواژه کاربری را تغییر دهید، این تغییر در سرور
 * اعمال خواهد شد.
 */
.factory(
		'PUser',
		function($http, $q, $httpParamSerializerJQLike, PObject, PProfile,
				$injector, PaginatorPage) {

			var pUser = function(data) {
				if (data) {
					this.setData(data);
					/*
					 * NOTE: فرض ما این هست که شناسه داره و این شناسه تغییر
					 * نمی‌کنه
					 */
					this.avatar = '/api/user/' + this.id + '/avatar';
				}
			};

			pUser.prototype = new PObject();

			/**
			 * اطلاعات حساب کاربری را به‌روزرسانی می‌کند
			 * 
			 * تغییراتی که در ساختارهای داده‌ای اعمال شده است را در سرور نیز
			 * اعمال می‌کند. تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای
			 * اعمال شده در این ساختار داده‌ای تنها در برنامه کاربر خواهد بود و
			 * با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد.
			 * 
			 * @memberof PUser
			 * 
			 * @return {promise(PUser)} ساختار داده‌ای به‌روز شده‌ی حساب کاربری
			 */
			pUser.prototype.update = function() {
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/user/' + this.id,
					data : $httpParamSerializerJQLike(scope),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(result) {
					scope.setData(result.data);
					return scope;
				});
			};

			/**
			 * حساب کاربری را حذف می‌کند
			 * 
			 * @memberof PUser
			 * 
			 * @return {promise(PUser)} ساختار داده‌ای حساب کاربری حذف شده
			 */
			pUser.prototype.remove = function() {
				var scope = this;
				return $http({
					method : 'DELETE',
					url : '/api/user/' + this.id,
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(result) {
					scope.setData(result.data);
					return scope;
				});
			};

			/**
			 * پروفایل کاربر را تعیین می‌کند.
			 * 
			 * @memberof PUser
			 * 
			 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری مربوط
			 *          به این حساب کاربری
			 */
			pUser.prototype.profile = function() {
				var deferred;
				if (this.isAnonymous()) {
					deferred = $q.defer();
					deferred.reject();
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/user/' + this.id + '/profile',
				}).then(function(res) {
					return new PProfile(res.data);
				});
			};

			/**
			 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی
			 * به صورت هم زمان انجام می‌شود.
			 * 
			 * @memberof PUser
			 * 
			 * @return {boolean} حالت مدیر بودن کاربر
			 */
			pUser.prototype.isAdministrator = function() {
				return (this.id && this.id > 0 && this.administrator);
			};

			/**
			 * تعیین می‌کند که آیا کاربر جاری staff است یا نه. این فراخوانی به
			 * صورت هم زمان انجام می‌شود.
			 * 
			 * @memberof PUser
			 * 
			 * @return {boolean} حالت staff بودن کاربر
			 */
			pUser.prototype.isStaff = function() {
				return (this.id && this.id > 0 && this.staff);
			};

			/**
			 * حذف یک رول از کاربر
			 * 
			 * برای حذف نقش باید خود نقش را داشته باشید.
			 * 
			 * @param {PRole}
			 *            نقش مورد نظر
			 * @return promise پارامتری برای خروجی در نظر گرفته نشده
			 */
			pUser.prototype.removeRole = function(role) {
				return $http({
					method : 'DELETE',
					url : '/api/user/' + this.id + '/role/' + role.id,
				});
			};

			/**
			 * فهرست نقش‌های کاربر را تعیین می‌کند
			 * 
			 * @param PaginationParameter
			 * @return promise(PaginatedPage(Role))
			 */
			pUser.prototype.roles = function(paginationParam) {
				var params = {};
				if (paginationParam) {
					params = paginationParam.getParameter();
				}
				return $http({
					method : 'GET',
					url : '/api/user/' + this.id + '/role/find',
					params : params
				}).then(function(res) {
					var $usr = $injector.get('$usr');
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var item = page.items[i];
						items.push($usr._roleCache(item.id, item));
					}
					page.items = items;
					return page;
				});
			};

			pUser.prototype.removeGroup = function() {
			};
			pUser.prototype.groups = function() {
			};

			return pUser;
		});
