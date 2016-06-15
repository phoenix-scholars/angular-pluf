/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc factory
 * @name PProfile
 * @description
 * هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری اطلاعات کلی می‌شود.
 * این اطلاعات برای هر نرم افزار می‌تواند متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل
 * دارید که شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره دانشجویی
 * است.
 *
 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید مقدار باشد
 * که شما می‌توانید مقادر مورد نظر خود را در آن اضافه و کم کنید.
 */
.factory('PProfile', function( $http, $httpParamSerializerJQLike, $q, PObject,
	 PException) {
	/**
	 * یک نمونه جدید از این موجودیت ایجاد می کند.
	 */
	var pProfile = function() {
		PObject.apply(this, arguments);
	};
	pProfile.prototype = new PObject();

	/**
	 * به روز رسانی پروفایل کاربری
	 */
	pProfile.prototype.update = function(key, value) {
		if (this.user.isAnonymous()) {
			var deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		var scope = this;
		var param = {};
		param[key] = value;
		return $http({
			method : 'POST',
			url : '/api/user/profile',
			data : $httpParamSerializerJQLike(param),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};
	return pProfile;
});
