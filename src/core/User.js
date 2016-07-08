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
 * ساختار داده‌ای یک کاربر 
 * ساختار داده‌ای یک کاربر را در سیستم تعیین می‌کند. از این مدل برای مدیریت کردن اطلاعات کاربری استفاده
 * می‌شود.
 *
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
	var pUser = function() {
		PObject.apply(this, arguments);
	};
	pUser.prototype = new PObject();

	/**
	 * تغییراتی که در ساختارهای داده‌ای اعمال شده است را در سرور نیز اعمال می‌کند.
	 * تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در این ساختار داده‌ای تنها
	 * در برنامه کاربر خواهد بود و با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد.
	 *
	 * @memberof PUser
	 * @return {promise<PUseer>} ساختار داده‌ای اصلاح شده
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
	 * پروفایل کاربر را تعیین می‌کند.
	 *
	 * @memberof PUser
	 * @returns {promise<PProfile>} قول اجرای غیر هم زمان
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
	 * @return {boolean} حالت مدیر بودن کاربر
	 */
	pUser.prototype.isAdministrator = function() {
		return (this.id && this.id > 0 && this.administrator);
	};
	return pUser;
});
