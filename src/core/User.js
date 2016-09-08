/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @ngdoc factory
 * @name PUser
 * @memberof pluf
 * 
 * @description
 * ساختار داده‌ای یک کاربر را در سیستم تعیین می‌کند. از این مدل برای مدیریت کردن اطلاعات کاربری استفاده
 * می‌شود.
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
 * @attr {Boolean} administrator تعیین می‌کند که آیا این کاربر دسترسی ادمین دارد یا نه
 * @attr {Boolean} staff تعیین می‌کند که این کاربر دسترسی staff دارد یا نه 
 *
 * از این موجودیت برای مدیریت (ایجاد، ویرایش و حذف) حساب کاربری استفاده می‌شود.
 * برای نمونه فرض کنید که می‌خواهیم نام یک کاربر را تغییر دهیم، برای این کار کد زیر باید استفاده
 * شود:
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
 * نکته: در صورتی که خصوصیت گذرواژه کاربری را تغییر دهید، این تغییر در سرور اعمال خواهد
 * شد.
 */
.factory('PUser', function($http, $q, $httpParamSerializerJQLike, PObject, PProfile) {
	
	var pUser = function(data) {
		if(data){
			this.setData(data);
		}
	};
	
	pUser.prototype = new PObject();

	/**
	 * اطلاعات حساب کاربری را به‌روزرسانی می‌کند
	 * 
	 * تغییراتی که در ساختارهای داده‌ای اعمال شده است را در سرور نیز اعمال می‌کند.
	 * تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در این ساختار داده‌ای تنها
	 * در برنامه کاربر خواهد بود و با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد.
	 *
	 * @memberof PUser
	 * 
	 * @return {promise(PUser)} ساختار داده‌ای به‌روز شده‌ی حساب کاربری
	 */
	pUser.prototype.update = function() {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/' + this.id + '/account',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
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
			url : '/api/user/' + this.id + '/account',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
			return scope;
		});
	};

	/**
	 * پروفایل کاربر را تعیین می‌کند.
	 *
	 * @memberof PUser
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری مربوط به این حساب کاربری
	 */
	pUser.prototype.profile = function() {
		var deferred;
		if (this.isAnonymous()) {
			deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		if (this._prof && !this._prof.isAnonymous()) {
			deferred = $q.defer();
			deferred.resolve(this._prof);
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'GET',
			url : '/api/user/' + this.id + '/profile',
		}).then(function(res) {
			scope._prof = new PProfile(res.data);
			scope._prof.user = scope;
			return scope._prof;
		});
	};

	/**
	 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی به صورت هم زمان انجام
	 * می‌شود.
	 *
	 * @memberof PUser
	 * 
	 * @return {boolean} حالت مدیر بودن کاربر
	 */
	pUser.prototype.isAdministrator = function() {
		return (this.id && this.id > 0 && this.administrator);
	};
	
	/**
	 * تعیین می‌کند که آیا کاربر جاری staff است یا نه. 
	 * این فراخوانی به صورت هم زمان انجام می‌شود.
	 *
	 * @memberof PUser
	 * 
	 * @return {boolean} حالت staff بودن کاربر
	 */
	pUser.prototype.isStaff = function() {
		return (this.id && this.id > 0 && this.staff);
	};
	
	
	return pUser;
});
