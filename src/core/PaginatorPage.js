/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @name PaginatorPage
 * @ngdoc factory
 * @memberof pluf
 * @description ساختار داده‌ای را تعیین می‌کند که در صفحه بندی داده‌ها به کار
 *              گرفته می‌شود. تمام داده‌های که از سرور ارسال می‌شود به صورت صفحه
 *              بندی است و تعداد آنها محدود است. این داده‌ها با این ساختار
 *              داده‌ای در اختیار کاربران قرار می‌گیرد.
 */
.factory('PaginatorPage', function(PObject) {
	var paginatorPage = function() {
		PObject.apply(this, arguments);
	};
	paginatorPage.prototype = new PObject();
	/**
	 * تعیین می‌کند که آیا تعداد بیشتری صفحه وجود دارد یا اینکه به انتهای این
	 * صفحه‌ها رسیدیم
	 * 
	 * @memberof PaginatorPage
	 * @return {boolean} وجود صفحه بیشتر
	 */
	paginatorPage.prototype.hasMore = function() {
		return (this.current_page < this.page_number);
	};
	/**
	 * تعیین اینکه صفحه اول هستیم
	 * 
	 * @memberof PaginatorPage
	 * @return {boolean} صفحه اول بودن
	 */
	paginatorPage.prototype.isFirst = function() {
		return this.current_page === 1;
	};
	paginatorPage.prototype.next = function() {
		return this.current_page + 1;
	};
	paginatorPage.prototype.previous = function() {
		return this.current_page - 1;
	};
	return paginatorPage;
});
