/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
