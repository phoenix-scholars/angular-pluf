/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PDiscount
 * @description ساختار داده‌ای تخفیف را ایجاد می‌کند. این ساختار داده‌ای شامل
 *              اطلاعات کلی از تخفیف است که از این میان می‌توان به موارد زیر
 *              اشاره کرد:
 * 
 * @attr {integer} id
 * @attr {string} code
 * @attr {string} discount_value
 * @attr {integer} valid_day
 * @attr {integer} count
 * @attr {integer} tenant
 */
.factory('PDiscount', function(PObject, $pluf) {

	var pDiscount = function() {
		PObject.apply(this, arguments);
	};
	pDiscount.prototype = new PObject();

	/**
	 * اطلاعات تخفیف را به روز می‌کند
	 * 
	 * @memberof PDiscount
	 * @return {promise} تخفیف جدید ایجاد شده
	 */
	pDiscount.prototype.update = $pluf.createUpdate({
		method : 'POST',
		url : '/api/discount/:id',
	});

	/**
	 * تخفیف را حذف می‌کند
	 * 
	 * @memberof PDiscount
	 * @return {promise} تخفیف حذف شده
	 */
	pDiscount.prototype.delete = $pluf.createDelete({
		method : 'DELETE',
		url : '/api/discount/:id'
	});

	return pDiscount;
});
