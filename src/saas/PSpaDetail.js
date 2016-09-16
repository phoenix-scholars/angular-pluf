/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PSpaDetail
 * @description
 * هر نسخه می‌تواند از یک نوع نرم افزار خاص نصب شده استفاده کند. البته نرم
 * افزارها باید تنها از خدمات ارائه شده در نسخه نصبی استفاده کنند. هر نرم افزار
 * می‌تواند شامل تنظیم‌های متفاتی باشد.
 */
.factory('PSpaDetail',
function($http, $q, $window, PObject) {
	var pSpaDetail = function() {
		PObject.apply(this, arguments);
	};
	pSpaDetail.prototype = new PObject();
	return pSpaDetail;
});
