/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PDiscountTypeType
 * @description ساختار داده‌ای برای نوع تخفیف (یا موتور تخفیف) را ایجاد می‌کند. این ساختار داده‌ای شامل
 *              اطلاعات کلی از یک نوع تخفیف است که از این میان می‌توان به موارد زیر
 *              اشاره کرد:
 * 
 * @attr {integer} id
 * @attr {string} type
 * @attr {string} title
 * @attr {integer} description
 */
.factory('PDiscountType', function(PObject) {

	var pDiscountType = function() {
		PObject.apply(this, arguments);
	};
	pDiscountType.prototype = new PObject();

	return pDiscountType;
});
