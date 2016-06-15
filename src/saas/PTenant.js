/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenant
 * @description
 *  ساختار داده‌ای یک ملک را تعیین می‌کنه
 */
.factory('PTenant', function(
	$http, $httpParamSerializerJQLike, $window, $q,
	PObject, PException, PProfile, PaginatorParameter, PaginatorPage,
	PSpa) {
	var pTenant = function() {
		PObject.apply(this, arguments);
	};
	pTenant.prototype = new PObject();

	pTenant.prototype._spa = [];
	pTenant.prototype._retSpa = function(spaData) {
		var t;
		if (spaData.id in this._spa) {
			t = this._spa[spaData.id];
			t.setData(spaData);
			return t;
		}
		t = new PSpa(spaData).setTenant(this);
		this._spa[t.id] = t;
		return t;
	};

	/**
	 * یک ملک را حذف می‌کند
	 *
	 * @memberof PTenant
	 * @return {promise<PTenant>} ملک حذف شده
	 */
	pTenant.prototype.delete = function(){
		//TODO:
	};

	/**
	 * اطلاعات ملک را به روز می‌کند
	 *
	 * @memberof PTenant
	 * @return {promise<PTenant>} خود ملک
	 */
	pTenant.prototype.update = function() {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/saas/' + this.id,
			data: $httpParamSerializerJQLike(this),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};

	/**
	 * تنظیم‌های یک ملک را تعیین می‌کند. این تنظیم‌ها توسط سیستم ایجاد شده است و تنها مدیریت
	 * سیستم قادر به تغییر آنها خواهد بود.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantSetting>} تنظیم‌های ملک
	 */
	pTenant.prototype.setting = function(){};

	/**
	 * تنظیم‌های ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantSetting>} تنظیم‌های ملک
	 */
	pTenant.prototype.config = function(){};

	// XXX: maso, 1395: مدل تعیین سطح دسترسی‌ها تعیین بشه
	pTenant.prototype.members = function() {
		if (this.isAnonymous() || this.memberLoaded()) {
			var deferred = $q.defer();
			if (this.isAnonymous()) {
				deferred.reject('authentication requried');
			}	else {
				deferred.resolve(this._member);
			}
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/app/' + this.id + '/member/list'
		}).then(function(res) {
			scope.$member.setData(res.data);
			return scope.$member;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * گروه‌های موجود در ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PaginatorPage<PTenantGroup>>} گروه‌های یک ملک
	 */
	pTenant.prototype.groups = function(){};

	/**
	 * اطلاعات گروه موجود در ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantGroup>} اطلاعات گروه
	 */
	pTenant.prototype.group = function(){};

	/**
	 * فهرست دسترسی‌ها را تعیین می‌کند. دسترسی افراد به داده‌ها و  نرم افزارها بر اساس نقش آنها
	 * در ملک تعیین می‌شود. تمام نقش‌ها و دسترسی‌ها نیز با استفاده از ساختار دسترسی تعریف
	 * می‌شود. این فراخوانی تمام دسترسی‌هایی که در این ملک تعریف شده است را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PaginatorPage<PTenantAccess>>} فهرست صفحه بندی شده دسترسی‌ها
	 */
	pTenant.prototype.accesses = function(){};

	/**
	 * یک دسترسی خاص را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantAccess>} دسترسی تعیین شده
	 */
	pTenant.prototype.access = function(){};

	/**
	 * یک دسترسی جدید در ملک ایجاد می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantAccess>} دسترسی معادل را تعیین می‌کند
	 */
	pTenant.prototype.newAccess = function(){};

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که در این ملک قابل دسترسی است.
	 *
	 * @memberof PTenant
	 * @param  {PaginatorPage} $params خصوصیت‌های صفحه بندی
	 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم افزارها به صورت صفحه بندی شده گ
	 */
	pTenant.prototype.spas = function($params) {
		if (!$params) {
			$params = new PaginatorParameter();
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/' + this.id + '/saas/spa/find',
			params: $params.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			var items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope.ret(page.items[i]);
				items.push(t);
			}
			page.items = items;
			return page;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * یک نرم افزار را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @param  {integer} spaId شناسه نرم‌افزار
	 * @return {promise<PSpa>} نرم افزار مورد نظر
	 */
	pTenant.prototype.spa = function(spaId) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/spa/' + spaId,
		}).then(function(res) {
			return scope._regSpa(res.data);
		});
	};

	/**
	 * یک نرم افزار جدید را برای ملک تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PSpa>} نرم‌افزار ایجاد شده
	 */
	pTenant.prototype.newSpa = function(){};


	/**
	 * ملک را اجرا و به آن تغییر مسیر می‌دهد.
	 *
	 * @memberof PTenant
	 */
	pTenant.prototype.goto = function() {
		// XXX: maso, 1394: Check domain, subdomain and id
		$window.location = $window.location.origin + '/' + this.id;
	};
	return pTenant;
});
