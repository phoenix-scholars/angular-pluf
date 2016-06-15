/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $preference
 * @description
 * مدیریت داده‌های محلی کاربر را انجام می‌دهد. این داده‌ها به صورت محلی در
 * مرورگر ذخیره سازی می‌شوند.‌
 */
 .service('$preference', function() {
	/**
	 * یک گره با نام جدید ایجاد می‌کند
	 * @memberof $preference
	 * @param  {String} nodeName نام گره
	 * @return {promise(PPreferenceNode)}   دستگیره گره جدید
	 */
	this.newNode = function() {};
	/**
	 * گره با مسیر تعیین شده را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof $preference
	 * @param  {String} path گره تنظیم‌ها
	 * @return {promise(PPreferenceNode)}     گره مورد نظر
	 */
	this.node = function() {};
	/**
	 * فهرست همه گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد
	 * @memberof $preference
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}  دستگیره فهرست گره‌ها
	 */
	this.nodes = function() {};
});
