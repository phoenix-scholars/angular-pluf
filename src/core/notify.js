/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$notify',[
			'$rootScope', '$timeout', '$q', 'PMessage',
			notify
		]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $notify
	 * @description
	 * تمام سیستم‌های گرافیکی نیاز به اعلام هشدار و یا پیام‌هایی به کاربران هستند. یکی از راه‌های مناسب
	 * برای انجام این کار استفاده از سیستم هشدار است. این سرویس توسط بخش‌های متفاوت گرافیکی
	 * شنود می‌شود و با صدور یک پیام، آن را به کاربران نشان می‌دهد.
	 *
	 * ساختار داده‌ای در نظر گرفته شده برای پیام‌ها کاملا باز است و کاربران می‌توانند هر ساختار داده‌ای را
	 * به عنوان پیام ارسال کنند. به صورت پیش فرض ساختاری مانند ساختار زیر به عنوان یک پیام در نظر
	 * گرفته می‌شود:
	 *
	 * <pre><code>
	 * {
	 * 	title: 'message title',
	 * 	message: 'message body',
	 * 	action: function(){
	 * 		// Message action
	 * 	}
	 * }
	 * </code></pre>
	 *
	 * این که در سیستم‌های نرم‌افزاری این پیام دقیقا چطور نمایش داده می‌شود کاملا وابسطه به واسط گرافیکی
	 * است و طراح گرافیکی در این زمینه کاملا آزاد است. در ادامه دسته‌ای از نمونه‌ها برای استفاده از این
	 * سرویس آورده شده است.
	 *
	 * @example
	 * //add info
	 * $notify.info({
	 * 	title: 'my title',
	 * 	message: 'my message'
	 * })
	 *
	 * @example
	 * //add error
	 * $notify.error({
	 * 	title: 'network error',
	 * 	message: 'network is not reachable. click to retry',
	 * 	action: function(){
	 * 		// Trye to reconnect
	 * 	}
	 * })
	 *
	 * @example
	 * $notify.onMessage(function(message){
	 * 	// message is instanceof PMessage
	 * 	openDialot(message);
	 * })
	 */
	function notify($rootScope, $timeout, $q, PMessage) {
		/*
		 * فهرست شنودگرهای
		 */
		this._listeners = [];
		this._fire = function(list, m) {
			var deferred = $q.defer();
			var ms= [];
			ms.push(new PMessage(m));
			$timeout(function() {
				for (var i = 0; i < list.length; i++) {
					list[i].apply(list[i], ms);
				}
				deferred.resolve();
			}, 10);
			return deferred.promise;
		};
		/**
		 * یک شنودگر جدید را به فهرست تمام شنودگرها اضافه می‌کند. در صورتی که پیامی در سیستم منتشر
		 * این شنودگر اجرا خواهد شد.
		 * @memberof $notify
		 * @param  {function} listener متدی که باید اجرا شود.
		 * @return {$notify}   خود سرویس
		 */
		this.onMessage = function(l) {
			this._listeners.push(l);
			return this;
		};
		/**
		 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
		 * @memberof $notify
		 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
		 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
		 */
		this.info = function(message) {
			message.type= 'info';
			return this._fire(this._listeners, message);
		};

		/**
		 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
		 * @memberof $notify
		 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
		 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
		 */
		this.warning = function(message) {
			message.type= 'warning';
			return this._fire(this._listeners, message);
		};

		/**
		 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
		 * @memberof $notify
		 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
		 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
		 */
		this.debug = function(message) {
			message.type= 'debug';
			return this._fire(this._listeners, message);
		};

		/**
		 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
		 * @memberof $notify
		 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
		 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
		 */
		this.error = function(message) {
			message.type= 'error';
			return this._fire(this._listeners, message);
		};
	}

// پایان
})();
