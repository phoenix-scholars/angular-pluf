/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $usr
 * 
 * @description
 * یکی از مهم‌ترین سرویس‌هایی است که در این ماژول ارائه می‌شود. این سرویس موظف است که کاربر جاری
 * را مدیریت کند. علاوه بر این امکاناتی برای ورود و خروج کاربران نیز فراهم کرده است.
 */
.service('$usr', function($http, $httpParamSerializerJQLike, $q, $act, 
	PUser, PaginatorPage) {
	/*
   * کاربر جاری را تعیین می‌کند. این متغیر به صورت عمومی در اختیار کاربران قرار می‌گیرد.
	 */
	this._su = new PUser();
	/*
	 * مخزن کاربران. تمام اطلاعاتی که از کاربران گرفته می‌شه توی این مخزن نگهداری می‌شه
	 */
	this._u = {};
	/*
	 * اطلاعات یک کاربر با شناسه تعیین شده را بازیابی می‌کند. این مقدار ممکن است تهی باشد.
	 */
	this._getUser = function(id) {
		if (this._u[id] &&! this._u[id].isAnonymous()) {
			return this._u[id];
		}
		return null;
	};
	/*
	 * اطلاعات یک کاربر را بازیابی می‌کند
	 */
	this._ret = function(id, data) {
		var instance = this._getUser(id);
		if (instance) {
			instance.setData(data);
		} else {
			instance = new PUser(data);
			this._u[id] = instance;
		}
		return instance;
	};

	/**
	 * به صورت همزمان تعیین می‌کند که آیا کاربر جاری شناخته شده است یا نه. از این فراخوانی در نمایش
	 * و یا جایی که باید به صورت همزمان وضعیت کاربر جاری را تعیین کرده استفاده می‌شود.
	 *
	 * @memberof $usr
	 * @return {Boolean} درستی در صورتی که کاربر جاری گمنام باشد
	 */
	this.isAnonymous = function() {
		return this._su.isAnonymous();
	};

	/**
	 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی نیز یک فراخوانی هم زمان
	 * است و در کارهای نمایشی کاربرد دارد.
	 *
	 * @memberof $usr
	 * 
	 * @return {Boolean} درستی در صورتی که کاربر جاری مدیر سیستم باشد.
	 */
	this.isAdministrator = function() {
		return this._su.isAdministrator();
	};
	
	/**
	 * عمل ورود کاربر به سیستم را انجام می‌دهد. برای ورود بسته به اینکه از چه سیستمی استفاده می‌شود
	 * پارامترهای متفاوتی مورد نیاز است که با استفاده از یک ساختار داده‌ای برای این فراخوانی ارسال
	 * می‌شود. برای نمونه در مدل عادی این فراخوانی نیاز به نام کاربری و گذرواژه دارد که به صورت
	 * زیر عمل ورود انجام خواهد شد:
	 *
	 * <pre><code>
	 * $usr.login({
	 * 	login: 'user name',
	 * 	password: 'password'
	 * }).then(function(user){
	 * 	//Success
	 * }, function(ex){
	 * 	//Fail
	 * });
	 * </code></pre>
	 *
	 * @memberof $usr
	 * 
	 * @param  {object} credential پارارمترهای مورد انتظار در احراز اصالت
	 * @return {promise(PUser)}   اطلاعات کاربر جاری
	 */
	this.login = function(c) {
		if (!this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this);
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/login',
			data : $httpParamSerializerJQLike(c),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope._su = new PUser(data.data);
			return scope._su;
		});
	};
	
	/**
	 * کاربری که در نشست تعیین شده است را بازیابی می‌کند. این فراخوانی که یک فراخوانی غیر همزان
	 * است برای تعیین حالت کاربر در سیستم استفاده می‌شود. برای نمونه ممکن است که یک تابع منجر
	 * به خروج کاربر از سیستم شده باشد، در این حالت این فراخوانی حالت کاربر را بازیابی کرده و سیستم
	 * را به روز می‌کند.
	 *
	 * @memberof $usr
	 * 
	 * @returns {promise(PUser)} اطلاعات کاربر جاری
	 */
	this.session = function() {
		var scope = this;
		if (!this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this._su);
			return deferred.promise;
		}
		return $http.get('/api/user/account').then(function(data) {
			scope._su = new PUser(data.data);
			return scope._su;
		});
	};
	
	/**
	 * این فراخوانی عمل خروج کاربری جاری از سیستم را انجام می‌دهد. با این کار تمام داده‌های کاربر
	 * جاری از سیستم حذف شده و سیستم به حالت اولیه برخواهد گشت.
	 *
	 * @memberof $usr
	 * 
	 * @returns {promise(PUser)} کاربر جاری که اکنون لاگ‌اوت شده است
	 */
	this.logout = function() {
		if (this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this._su);
			return deferred.promise;
		}
		var scope = this;
		return $http.post('/api/user/logout', {})//
		.success(function() {
			scope._su.setData({
				id : 0,
				login : null,
				administrator: false
			});
			return scope._su;
		});
	};

	/**
	 * اطلاعات یک کاربر جدید را دریافت کرده و آن را به عنوان یک کاربر در سیستم ثبت می‌کند. حالت
	 * نهایی کاربر به نوع پیاده سازی سرور بستگی دارد. بر برخی از سرورها، به محض اینکه کاربر ثبت
	 * نام کرد حالت فعال رو داره و می‌تونه وارد سیستم بشه اما در برخی از سیستم‌ها نیاز به فرآیند
	 * فعال سازی دارد.
	 *
	 * پارامترهای مورد نیاز برای ایجاد کاربر هم متفاوت هست. در برخی سیستم‌ها ایمیل، نام کاربری و گذرواژه
	 * مهم است و سایر پارامترهای به صورت دلخواه خواهد بود.
	 *
	 * @memberof $usr
	 * 
	 * @param  {object} detail خصوصیت‌های کاربر
	 * @return {promise(PUser)} حساب کاربری ایجاد شده
	 */
	this.signup = function(detail) {
		// var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/signup',
			data : $httpParamSerializerJQLike(detail),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			var user = new PUser(data.data);
			return user;
		});
	};
	
	/**
	 * فهرست کاربران را به صورت صفحه بندی شده در اختیار قرار می‌دهد. این فهرست
	 * برای کاربردهای متفاوتی استفاده می‌شود مثل اضافه کردن به کاربران مجاز. دسترسی به فهرست
	 * کاربران تنها بر اساس سطوح امنیتی تعریف شده در سرور ممکن است و بسته به نوع پیاده سازی
	 * سرور متفاوت خواهد بود.
	 *
	 * @memberof $usr
	 * 
	 * @param {PagintorParameter} parameter پارامترهای مورد استفاده در صفحه بندی نتایج
	 * @return {promise(PaginatorPage)} صفحه‌ای از کاربران سیستم.
	 */
	this.users = function(p) {
		var scope = this;
		return $http({
			method : 'GET',
			url : '/api/user/find',
			params : p.getParameter()
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			var items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope._ret(page.items[i].id, page.items[i]);
				items.push(t);
			}
			page.items = items;
			return page;
		});
	};

	/**
	 * اطلاعات کاربر جاری را به روزرسانی می‌کند.
	 *
	 * @memberof $usr
	 * 
	 * @return {promise(PUser)} اطلاعات به‌روزرسانی شده‌ی کاربر جاری
	 */
	this.updateCurrentUser = function() {
		if (!this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this);
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/' + scope._su.id + '/account',
			data : $httpParamSerializerJQLike(scope._su),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			var user = new PUser(data.data);
			return user;
		}, function(data) {
			throw new PException(data);
		});
	};
	
	/**
	 * اطلاعات کاربر را با استفاده از شناسه آن بازیابی می‌کند.
	 *
	 * @memberof $usr
	 * 
	 * @param  {string} id شناسه کاربر مورد نظر
	 * @return {promise(PUser)} اطلاعات بازیابی شده کاربر
	 */
	this.getUser = function(id) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/user/' + id + '/account',
		}).then(function(data) {
			return scope._ret(data.data.id, data.data);
		});
	};
	
	/**
	 * اطلاعات کاربر با شناسه تعیین شده را به‌روزرسانی می‌کند
	 * 
	 * @memberof $usr
	 * 
	 * @param {string} id شناسه کاربر مورد نظر
	 * @return {promis(PUser)} اطلاعات به‌روزرسانی شده‌ی کاربر
	 */
	this.updateUser = function(id, userData) {
		return $http({
			method : 'POST',
			url : '/api/user/' + id + '/account',
			data : $httpParamSerializerJQLike(userData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			var user = new PUser(data.data);
			return user;
		}, function(data) {
			throw new PException(data);
		});
	};
	
	/**
	 * کاربر با شناسه تعیین شده را حذف می‌کند
	 * 
	 * @memberof $usr
	 * 
	 * @param {string} id شناسه کاربر مورد نظر
	 * @return {promis(PUser)} اطلاعات کاربر حذف شده به عنوان خروجی برگردانده می‌شود
	 */
	this.removeUser = function(id) {
		return $http({
			method : 'DELETE',
			url : '/api/user/' + id + '/account',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			var user = new PUser(data.data);
			return user;
		}, function(data) {
			throw new PException(data);
		});
	};
	
	/**
	 * اطلاعات کاربر را با استفاده نام کاربری آن بازیابی می‌کند.
	 * کاربر با استفاده از آن می‌تواند وارد سیستم شود.
	 *
	 * @memberof $usr
	 * @param  {string} login شناسه کاربر مورد نظر
	 * @return {promise(PUser)}   اطلاعات بازیابی شده کاربر
	 */
	this.user = function(login) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/user/user/' + login,
		}).then(function(data) {
			return scope._ret(data.data.id, data.data);
		});
	};
});
