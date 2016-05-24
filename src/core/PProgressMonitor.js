/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PProgressMonitor', [
			'PObject',
			PProgressMonitor
		]);

	/**
	 * @memberof pluf
	 * @ngdoc factory
	 * @name PProgressMonitor
	 * @description
	 * حالت را در سیستم ایجاد می‌کند از این کلاس برای تعیین حالت بخش‌های متفاوتی از
	 * سیستم استفاده می‌شود که ممکن است به صورت پویا تغییر کنند.
	 *
	 * میزان پیشرفت کار درحقیقت یک مانیتور است که اطلاعاتی راجع به فرآنید انجام کار
	 * را تعیین می‌کند. در اینجا موارد زیر برای یک حالت در نظر گرفته شده است:
	 *
	 * @example
	 *  // Start
	 *  PProgressMonitor monitor = new PProgressMonitor();
	 *  // Init
	 *  monitor.setTask("task name")
	 *  	.setTotalWork(10)
	 *  	.setWorked(0)
	 *  	.setState(PProgressMonitor.WORKING);
	 *  var i = 0;
	 *  for(i = 0; i < 10; i++){
	 *  	//Do something
	 *  	monitor
	 *  		.setWorked(i)
	 *  		.setSubTask('Sub task title:'+i);
	 *  }
	 *  monitor
	 *  	.setState(PProgressMonitor.FINISH);
	 */
	function PProgressMonitor(PObject) {
		var PProgressMonitor = function() {
			PObject.apply(this, arguments);
		};
		var pProgressMonitor = function(data) {
			if (data) {
				this._s = 1;
				this._tw = 100;
				this._t = 0;
				this.setData(data);
			}
		};
		pProgressMonitor.prototype = {
			/**
			 * حالت انتظار برای این پیشرفت کار را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @type {Number}
			 */
			WAIT : 0,
			/**
			 * حالت انجام کار را تعیین می‌کند
			 * @memberof PProgressMonitor
			 * @type {Number}
			 */
			WORKING : 1,
			/**
			 * حالت پایان را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @type {Number}
			 */
			FINISH : 2,
			/**
			 * حالت خطا را برای کار تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @type {Number}
			 */
			ERROR : 3,
			/**
			 * تعداد کل کارهایی که تا حال انجام شده را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @param  {Integer} w تعداد کل کارها
			 * @return {PProgressMonitor}   خود پیشرفت کار را به عنوان خروجی برمی‌گرداند
			 */
			setWorked : function(w) {
				this._w = w;
				return this;
			},
			/**
			 * به میزان کار انجام شده یک تعداد ثابت اضافه می‌کند.
			 * @memberof PProgressMonitor
			 * @param  {Integer} w تعداد کار انجام شده جدید
			 * @return {PProgressMonitor}   خود ساختار داده‌ای پیشرفت کار
			 */
			addWorked : function(w) {
				if (this._w) {
					this._w += w;
				} else {
					this._w = w;
				}
				return this;
			},
			/**
			 * تعداد کارهایی که انجام شده است را تعیین می‌کند. این مقدار در متغیری به نام _w ذخیره می‌شود
			 * که می‌تواند در نمایش نیز به کار رود اما توصیه می‌کنم که او همین فراخوانی در نمایش استفاده
			 * کنید.
			 * @memberof PProgressMonitor
			 * @return {Integer} تعداد کارها
			 */
			worked : function() {
				return this._w;
			},
			/**
			 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @param  {Integer} tw تعداد کل کارهایی که باید انجام شود.
			 * @return {PProgressMonitor}  خود ساختار داده‌ای پیشرفت کار.
			 */
			setTotalWork : function(tw) {
				this._tw = tw;
				return this;
			},
			/**
			 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @return {Integer} تعداد کل کارها
			 */
			totalWork : function() {
				return this._tw;
			},
			/**
			 * میزان پیشرفت کار را به درصد تعیین می‌کند. این مقدار با روش ساده تقسم به دست می‌آیدکه
			 * از رابطه زیر پیروی می‌کند:
			 *
			 * P = worked / totalWork * 100
			 *
			 * در صورتی که مقادیر اشتباهی برای تعداد کل کارها و کارهای انجام شده تعیین شده باشد مقدار
			 * -۱ به عنوان نتیجه برگردانده خواهد شد.
			 * @memberof PProgressMonitor
			 * @return {Number} درصد پیشرفت کار
			 */
			percentage : function() {
				return this._w * 100 / this._tw;
			},
			/**
			 * عنوان کار اصلی را تعیین می‌کند. این عنوان در نمایش به کار گرفته می‌شود.
			 * @memberof PProgressMonitor
			 * @param  {String} t عنوان اصلی کار
			 * @return {PProgressMonitor}  خود ساختار داده‌ای
			 */
			setTask : function(t) {
				this._t = t;
				return this;
			},
			/**
			 * عنوان اصل کار را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @return {String} عنوان اصلی کار
			 */
			task : function() {
				return this._t;
			},
			/**
			 * عنوان کار جاری را تعیین می‌کند. در این مدل فرض کرده‌ایم که هر کار از چندین زیر وظیفه
			 * تشکیل می‌شود که در دوره‌های زمانی به صورت پشت سر هم انجام می‌شوند.
			 * @param  {String} st عنوان زیر وظیفه
			 * @return {PProgressMonitor}    خود ساختار داده‌ای پیشرفت کار.
			 */
			setSubTask : function(st) {
				this._st = st;
				return this;
			},
			/**
			 * عنوان زیر وظیفه را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @return {String} عنوان زیر وظیفه
			 */
			subTask : function() {
				return this._st;
			},
			/**
			 * حالت زیر این کار را تعیین می‌کند. حالت با استفاده از یک عدد تعیین می‌شود که مقادیر متفاوت
			 * آن معانی خاصی دارد. این مقادر در توصیف این موجودیت آورده شده است.
			 * @memberof PProgressMonitor
			 * @param  {Integer} s حالت کار
			 * @return {PProgressMonitor}   خود ساختار داده‌ای
			 */
			setState : function(s) {
				this._s = s;
				return this;
			},
			/**
			 * حالت کار را تعیین می‌کند.
			 * @memberof PProgressMonitor
			 * @return {Integer} حالت کار
			 */
			state : function() {
				return this._s;
			},
			/**
			 * پایان یافتن کار را تعیین می‌کند. در صورتی که کار با موفقیت و یا عدم موفقیت تمام شود این
			 * فراخوانی مقدار درستی را برمی‌گرداند.
			 * @memberof PProgressMonitor
			 * @return {Boolean} درستی در صورت پایان کار
			 */
			isDone : function() {
				return this._s == this.FINISH;
			}
		};
		return pProgressMonitor;
	}

//End
})();
