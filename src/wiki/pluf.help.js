'use strict';

/**
 * @ngdoc module
 * @name pluf.help
 * 
 * @description
 * ماژول pluf.help مجموعه‌ای از امکانات را برای پیاده‌سازی یک ویکی فراهم می‌کند.
 * عناصر اصلی این ماژول Page و Book است و عملیاتی مدیریت آن‌ها مانند ایجاد، ویرایش، حذف و دریافت 
 * آنها در این ماژول قرار داده شده است.
 */
angular.module('pluf.help', ['pluf'])


/**
 * فیلتر نمایش صفحه‌ها را ایجاد می‌کند.
 */
.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
