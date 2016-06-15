/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PSpa
 * @description
 * اطلاعات یک نرم افزار را تعیین می‌کند.
 *
 * @attr {integer} id
 * @attr {string} name
 *
 */
.factory('PSpa', function($http, $q, $window, PSpaDetail, PObject) {

	var pSpa = function() {
		PObject.apply(this, arguments);
	};

	pSpa.prototype = new PObject();

	/**
	 * ملک پیش فرض را تعیین می‌کند. به صورتی پیش فرض یک نرم افزار به ملک خاصی تعلق ندارد
	 * اما برای سادگی توسعه اگر فهرست نرم افزارهای یک ملک را بگیرید ملک پیش فرض آن نیز
	 * تعیین می‌شود.
	 *
	 * @memberof PSpa
	 * @param  {PTenant} tenant ملک پیش فرض
	 * @return {PSpa}  خود نرم افزار
	 */
	pSpa.prototype.setTenant = function(tenant) {
		this._tenant = tenant;
		return this;
	};

	/**
	 * اطلاعات نرم افزار را دوباره بازیابی می‌کند. زمانی که یک نرم افزار به روز شده باشد با این
	 * فراخوانی اطلاعات جدید آن بارگذاری می‌شود.
	 *
	 * @memberof PSpa
	 * @return {PSpa} خود نرم افزار
	 */
	pSpa.prototype.reload = function(){};

	/**
	 * نرم افزار را به روز رسانی می‌کنند.
	 *
	 * @memberof PSpa
	 * @return {promise<PSpa>} نرم افزار به روز شده
	 */
	pSpa.prototype.update = function(){};

	/**
	 * نرم افزار را حذف می‌کند.
	 *
	 * @return {PSpa} نرم افزار حذف شده
	 */
	pSpa.prototype.delete = function(){};

	/**
	 * جزئیات یک نرم افزار را تعیین می‌کند. این جزئیات شامل اطلاعاتی مثل نویسندگان، ادرس تارنما
	 * و سایر مواردی می شود که توسعه دهنده در اختیار ما قرار می‌دهد.
	 *
	 * @memberof PSpa
	 * @return {PSpaDetail} جزئیات نرم افزار
	 */
	pSpa.prototype.detail = function() {
		if (this._detail) {
			var def = $q.defer();
			def.resolve(this._detail);
			return def.promise;
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/spa/' + this.id + '/detail',
		}).then(function(res) {
			scope._detail = new PSpaDetail(res.data);
			return scope._detail;
		});
	};

	/**
	 * اجرای نرم افزار.
	 *
	 * @memberof PSpa
	 */
	pSpa.prototype.run = function() {
		$window.location = $window.location.origin + '/' + this._tenant.id + '/' + this.id;
	};

	return pSpa;
});
