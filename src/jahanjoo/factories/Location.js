/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
//
//angular.module('pluf.jahanjoo')
//
///**
// * ساختار داده‌ای یک مکان را ایجاد می‌کند. علاوه بر این ابزارهای اولیه مورد نیاز
// * برای دستکاری مکان را نیز در اختیار می‌گذارد
// */
//.factory('PLocation', function($http, PObject, PException) {
//	/**
//	 * یک نمونه جدید از این کلاس ایجاد می‌کند.
//	 */
//	var pLocation = function() {
//		PObject.apply(this, arguments);
//	};
//	pLocation.prototype = new PObject();
//
//	/**
//	 * این مکان را از سیستم حذف می‌کند.
//	 */
//	pLocation.prototype.remove = function() {
//		var scope = this;
//		return $http({
//			method : 'DELETE',
//			url : '/api/jayab/location/' + this.id,
//		}).then(function(res) {
//			scope.id = 0;
//			return scope;
//		}, function(res) {
//			throw new PException('fail to delete the location.', res.data);
//		});
//	}
//	// returns module
//	return pLocation;
//});

