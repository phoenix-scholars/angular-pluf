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
 * @memberof pluf
 * @ngdoc factory
 * @name PException
 * @description
 * ساختار اصلی خطا در کل سیستم را تعریف می‌کند. این ساختار داده‌ای مشابه با ساختارهایی است
 * که در قرارداد پلاف تعیین شده است علاوه بر این امکاناتی برای کار با یک خطای تولید شده دارد.
 *
 * ساختار داده‌ای خطا بسته به حالت سرور می‌تواند متفاوت باشد. زمانی که سرور در حالت رفع خطا
 * باشد، اطلاعات بیشتری در این ساختار داده‌ای وجود دارد اما در حالت نهایی تنها اطلاعات مورد نیاز
 * برای کاربران وجود خواهد داشت.
 *
 * در پروژه سین (https://gitlab.com/phoenix-scholars/seen) فهرست کامل پارامترهای ارسالی
 * از سمت سرور و کدهای خطا تعیین شده است. در اینجا فهرست مهم‌ترین خصوصیت‌های این ساختار
 * بیان شده است.
 *
 * @attr {Integer} state کد خطای تولید شده که بر اساس استاندارد کدهای HTTP تعیین می‌شود.
 * @attr {Integer} code کد خطای ایجاد شده که بر اساس ساختارهای سرور و پرتکل سین تعیین می‌شود
 * @attr {String} message پیام ارسالی از سمت سرور
 * @attr {url} link آدرسی که در آن اطلاعات بیشتری در این رابطه وجود دارد
 * @attr {Struct} data ساختار داده‌ای متناسب با خطا. در این ساختار اگر خطا در رابطه با یک پارامتر ورودی باشد تعیین خواهد شد.
 */
.factory('PException', function(PObject) {
	var pException = function() {
		PObject.apply(this, arguments);
	};
	pException.prototype = new PObject();
	return pException;
});
