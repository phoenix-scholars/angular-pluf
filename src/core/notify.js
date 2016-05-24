/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$notify',[
			'$rootScope', '$timeout', '$q',
			notify
		]);
	/**
	 * @memberof pluf.core
	 * @ngdoc service
	 * @name $notify
	 * @description
	 * یک سیستم ساده است برای اعلام پیام در سیستم. با استفاده از این کلاس می‌توان
	 * پیام‌های متفاوتی که در سیستم وجود دارد را به صورت همگانی اعلام کرد.
	 */
	function notify($rootScope, $timeout, $q) {
		/*
		 * فهرست شنودگرهای
		 */
		this._info = [];
		this._warning = [];
		this._debug = [];
		this._error = [];
		this._fire = function(list, args) {
			var deferred = $q.defer();
			$timeout(function() {
				for (var i = 0; i < list.length; i++) {
					list[i].apply(list[i], args);
				}
				deferred.resolve();
			}, 10);
			return deferred.promise;
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onInfo = function(listener) {
			this._info.push(listener);
			return this;
		};
		/**
		 * تمام واسطه‌های تعیین شده برای پیام را فراخوانی کرده و آنها را پیام ورودی
		 * آگاه می‌کند.
		 */
		this.info = function() {
			return this._fire(this._info, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onWarning = function(listener) {
			this._warning.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌های اخطاری که در سیستم تولید شده است را به سایر شنودگرها ارسال
		 * کرده و آنها را از بروز آن آگاه می‌کند.
		 */
		this.warning = function() {
			return this._fire(this._warning, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onDebug = function(listener) {
			this._debug.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌هایی که برای رفع خطا در سیستم تولید می‌شود را برای تمام
		 * شنودگرهای اضافه شده ارسال می‌کند.
		 */
		this.debug = function() {
			return this._fire(this._debug, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onError = function(listener) {
			this._error.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌های خطای تولید شده در سیتسم را برای تمام شوندگرهایی خطا صادر
		 * کرده و آنها را از آن مطلع می‌کند.
		 */
		this.error = function() {
			return this._fire(this._error, arguments);
		};
		/*
		 * یک رویداد خاص را در کل فضای نرم افزار انتشار می‌دهد. اولین پارامتر ورودی
		 * این تابع به عنوان نام و شناسه در نظر گرفت می‌شود و سایر پارامترها به
		 * عنوان پارامترهای ورودی آن.
		 */
		this.broadcast = function() {
			return $rootScope.$broadcast.apply($rootScope, arguments);
		};
	}

// پایان
})();
