/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PPreferenceProperty
 * @description
 *
 * ساختار یک تنظیم را تعیین می‌کند که در یک گره از تنظیم‌ها قرار می‌گیرد. همانگونه که گفته شد، هر
 * گره می‌تواند شامل مجموعه‌ای از تنظیم‌ها باشد. تمام تنظیم‌های موجود در هر گره  با استفاده از این
 * ساختارها ایجاد می‌شوند.
 */
.factory('PPreferenceProperty', function(PPreferenceNode) {
	var pPreferenceProperty = function() {
		PPreferenceNode.apply(this, arguments);
	};
	pPreferenceProperty.prototype = new PPreferenceNode();
	/**
	 * مقدار جدید را برای این خصوصیت تعیین می‌کند
	 * @param {Object} newValue مقدار جدید
	 */
	pPreferenceProperty.prototype.setValue = function(){};
	/**
	 * مقدار خصوصیت را تعیین می‌:کند.
	 * @return {Object} مقدار خصوصیت
	 */
	pPreferenceProperty.prototype.value = function(){};
	return pPreferenceProperty;
});
