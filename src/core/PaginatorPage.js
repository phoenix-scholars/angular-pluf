/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @name PaginatorPage
 * @ngdoc factory
 * @memberof pluf
 * @description
 * ساختار داده‌ای را تعیین می‌کند که در صفحه بندی داده‌ها به کار گرفته می‌شود. تمام داده‌های که
 * از سرور ارسال می‌شود به صورت صفحه بندی است و تعداد آنها محدود است. این داده‌ها با
 * این ساختار داده‌ای در اختیار کاربران قرار می‌گیرد.
 */
.factory('PaginatorPage', function(PObject) {
	var paginatorPage = function() {
		PObject.apply(this, arguments);
	};
	paginatorPage.prototype = new PObject();
	/**
	 * تعیین می‌کند که آیا تعداد بیشتری صفحه وجود دارد یا اینکه به انتهای این صفحه‌ها رسیدیم
	 *
	 * @memberof PaginatorPage
	 * @return {boolean} وجود صفحه بیشتر
	 */
	paginatorPage.prototype.hasMorePage = function() {
		return this.response && (this.response.current_page < this.response.page_number);
	};
	return paginatorPage;
});
