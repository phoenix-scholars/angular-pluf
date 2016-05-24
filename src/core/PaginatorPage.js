/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PaginatorPage', [
			'PObject',
			PaginatorPage
		]);

	/**
	 * @name PaginatorPage
	 * @ngdoc factory
	 * @memberof pluf
	 * @description
	 * ساختار داده‌ای را تعیین می‌کند که در صفحه بندی داده‌ها به کار گرفته می‌شود. تمام داده‌های که
	 * از سرور ارسال می‌شود به صورت صفحه بندی است و تعداد آنها محدود است. این داده‌ها با
	 * این ساختار داده‌ای در اختیار کاربران قرار می‌گیرد.
	 */
	function PaginatorPage(PObject) {
		var paginatorPage = function() {
			PObject.apply(this, arguments);
		};
		paginatorPage.prototype = new PObject();
		return paginatorPage;
	}

// پایان
})();