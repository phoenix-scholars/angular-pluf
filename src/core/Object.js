/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function() {
	angular
		.module('pluf')
		.factory('PObject',[PObject]);
		/**
			* @memberof pluf
			* @ngdoc factory
			* @name PObject
			*
			* @description
			* مهم‌ترین موجودیت در سیستم است.
			*
			* @attr {Integer} id
			* شناسه موجودیت را تعیین می‌کند.
			*
			* @example
			*   Usage:
			*   <map MAP_OPTIONS_OR_MAP_EVENTS ..>
			*     ... Any children directives
			*   </map>
			*
			*   <map center="[40.74, -74.18]" on-click="doThat()">
			*   </map>
			*
			*   <map geo-fallback-center="[40.74, -74.18]" zoom-to-inlude-markers="true">
			*   </map>
		  */
		function PObject() {
			/**
		   * این فراخوانی یک نمونه جدید از این موجودیت ایجاد کرده و مقادیر داده ورودی را به عنوان داده‌های
		   * این موجودیت قرار می‌دهد.
		   *
		   * @memberof PObject
		   * @param {data} ساختار داده‌ای موجودیت مورد نظر
			 */
			var pObject = function(data) {
				if (data) {
					this.setData(data);
				}
			};
			pObject.prototype = {
				/**
				 * داده‌های دریافتی را تعیین می‌کند
				 *
				 * @memberof PObject
				 * @param {data} ساختار داده‌ای اولیه
				 */
				setData : function(data) {
					angular.extend(this, data);
				},
				/**
				 * تعیین می‌کند که آیا ساختارهای داده‌ای نشان دارند. زمانی که یک ساختار
				 * داده‌ای شناسه معتبر داشته باشد و سمت کارگذار ذخیره شده باشد به عنوان
				 * یک داده نشان دار در نظر گرفته می‌شود. در غیر این صورت داده نا معتبر بوده و نباید در
				 * پردازش‌ها در نظر گرفته شود.
				 *
				 * نمونه‌ای از کاربردهای این فراخونی تعیین حالت کاربر است. در صورتی که خروجی این
				 * فراخوانی مقدار درستی باشد به معنی نا معتبر بودن کاربر است.
				 *
				 * زمانی که دوره زمانی زیادی از یک موجودیت گذشته باشد و با سرور هماهنگ نشده باشد نیز
				 * مقدار این تابع درستی خواهد بود از این رو سرویس‌ها باید این مدل داده‌ها را نادیده بگیرند. این
				 * روش در مدیریت کش کاربرد دارد.
				 *
				 * @memberof PObject
				 * @returns {Boolean} معتبر بودن ساختار داده
				 */
				isAnonymous : function() {
					return !(this.id && this.id > 0);
				}
			};
			return pObject;
		}
})();
