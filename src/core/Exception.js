/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
