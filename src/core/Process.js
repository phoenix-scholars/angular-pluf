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
 * @name PProcess
 * @description
 * حالت را در سیستم ایجاد می‌کند از این کلاس برای تعیین حالت بخش‌های متفاوتی از
 * سیستم استفاده می‌شود که ممکن است به صورت پویا تغییر کنند.
 *
 * میزان پیشرفت کار درحقیقت یک مانیتور است که اطلاعاتی راجع به فرآنید انجام کار
 * را تعیین می‌کند. در اینجا موارد زیر برای یک حالت در نظر گرفته شده است:
 *
 * @attr {Integer} id شناسه این پردازش را تعیین می‌کند. تمام پردازش‌هایی که به صورت محلی
 * ایجاد می‌شوند این شناسه را ندارند.
 *
 * @attr {string[]} tags فهرستی از برچسب‌ها را تعیین می‌کند که برای این پردازش در نظر
 * گرفته شده است. هر تگ با استفاده از یک رشته معمولی تعیین می‌شود.
 *
 * @attr {string} progress.taskName عنوان یک وظیفه را تعیین می‌کند.
 *
 * @attr {string} progress.subTask عنوان هر زیر وظیفه را تعیین می‌کند.
 *
 * @attr {string} progress.totalWork تعداد کل کارهایی را تعیین می‌کند که باید انجام شود.
 * در صورتی که مقدار منفی یا صفر باری این متغییر تعیین شود به معنی کاری خواهد بود که نمی‌توان
 * برای آن تخمینی از مراحل کار داشت.
 *
 * @attr {string} progress.worked تعداد کارهایی را تعیین می‌کند که تا حالا انجام شده است
 *
 * @attr {string} progress.status حالت پایان یک کار را تعیین می‌کند. در صورتی که این
 * مقدار تهی باشد به این معنی است که هنوز کار تمام نشده و در حال انجام است.
 *
 * @attr {string} progress.status.severity شدت پایان کار را تعیین می‌کند. این شدت با
 * یه سری عدد ثابت تعیین می‌شود که به صورت ثابت در کلاس تعریف شده است. این شدت در
 * عمل حالت اصلی را تعیین می‌کند. برای نمونه حالت موفقیت یا حالت خطا.
 *
 * @attr {string} progress.status.code کد حالت پایان را تعیین می‌کند. این کد تعریف نشده
 * است و در هر نرم افزار ممکن است معنی خاصی داشته باشد.
 *
 * @attr {string} progress.status.message پیام پایان کار را تعیین می‌کند.
 *
 *
 * @example
 *  // Start
 *  PProcess process = new PProcess();
 *  // Init
 *  process.setTask("task name")
 *  	.setTotalWork(10)
 *  	.setWorked(0);
 *  var i = 0;
 *  for(i = 0; i < 10; i++){
 *  	//Do something
 *  	monitor
 *  		.setWorked(i)
 *  		.setSubTask('Sub task title:'+i);
 *  }
 *  monitor
 *  	.setStatus({
 *  		severity: PProcess.OK,
 *  		code: 1,
 *  		message: 'job complit'
 *  	});
 *
 * @example
 * <div ng-hide="process.status">
 * 	<h2>Process is running</h2>
 * 	<h1>{ {process.taskName()} }</h1>
 * 	<h4>{ {process.subTask()} }</h1>
 * 	<p>{ {process.percentage()} }</p>
 * </div>
 * <div ng-show="process.status">
 * 	<h2>Process is running</h2>
 * 	<h3>{ {process.status.severity} }</h3>
 * 	<h3>{ {process.status.code} }</h3>
 * 	<h3>{ {process.status.message} }</h3>
 * </div>
 */
.factory('PProcess', function(PObject) {
	var pProcess = function() {
		PObject.apply(this, arguments);
		if(!this.progress){
			this.progress = {};
		}
	};

	/**
	 * این ثابت حالت پایانی موفق را تعیین می‌کند. این ثابت به عنوان شدت برای حالت پایانی در
	 * نظر گرفته می‌شود.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.OK = 0;

	/**
	 * حالت پایانی پیام را تعیین می‌کند. در این حالت کار تمام شده ولی یک پیام برای کاربرا وجود
	 * دارد.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.INFO = 1;

	/**
	 * حالت پایانی اخطار را تعیین می‌کند. در این حالت کار با مشکلاتی روبرو بوده و پیام ارسال
	 * شده برای کاربر این موضوع را تعیین می‌کند.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.WARNING = 2;

	/**
	 * حالت پایانی خطا را تعیین می‌کند. در این حالت کار نتوانسته با موفقیت انجام شود. پیامی نیز
	 * تعیین شده که بیان کننده خطا ایجاد شده در انجام این پردازش است.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.ERROR = 4;

	/**
	 * حالت پایانی منحل شدن پیام را تعیین می‌کند. این حالتی است که کاربر پردازش را منحل کرده
	 * و سیستم در انجام آن تاثیری نداشته.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.CANCEL = 8;

	/**
	 * تعداد کل کارهایی که تا حال انجام شده را تعیین می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} w تعداد کل کارها
	 * @return {PProgressMonitor}   خود پیشرفت کار را به عنوان خروجی برمی‌گرداند
	 */
	pProcess.prototype.setWorked = function(w) {
		this.progress.worked = w;
		return this;
	};

	/**
	 * اندازه کارهایی که انجام شده است را تعیین می‌کند.
	 * @memberof PProcess
	 * @return {Integer} اندازه کارهایی که انجام شده است
	 */
	pProcess.prototype.worked = function() {
		return this.progress.worked;
	};

	/**
	 * به میزان کار انجام شده یک تعداد ثابت اضافه می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} w تعداد کار انجام شده جدید
	 * @return {PProgressMonitor}   خود ساختار داده‌ای پیشرفت کار
	 */
	pProcess.prototype.addWorked = function(w) {
		if (this.progress.worked) {
			this.progress.worked += w;
		} else {
			this.progress.worked = w;
		}
		return this;
	};

	/**
	 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} tw تعداد کل کارهایی که باید انجام شود.
	 * @return {PProgressMonitor}  خود ساختار داده‌ای پیشرفت کار.
	 */
	pProcess.prototype.setTotalWork = function(tw) {
		this.progress.totalWorked = tw;
		return this;
	};

	/**
	 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
	 * @memberof PProcess
	 * @return {Integer} تعداد کل کارها
	 */
	pProcess.prototype.totalWork = function() {
		return this.progress.totalWorked;
	};

	/**
	 * میزان پیشرفت کار را به درصد تعیین می‌کند. این مقدار با روش ساده تقسم به دست می‌آیدکه
	 * از رابطه زیر پیروی می‌کند:
	 *
	 * P = worked / totalWork * 100
	 *
	 * در صورتی که مقادیر اشتباهی برای تعداد کل کارها و کارهای انجام شده تعیین شده باشد مقدار
	 * -۱ به عنوان نتیجه برگردانده خواهد شد.
	 * @memberof PProcess
	 * @return {Number} درصد پیشرفت کار
	 */
	pProcess.prototype.percentage = function() {
		if(this.progress.totalWorked <= 0){
			return 0;
		}
		return this.progress.worked * 100 / this.progress.worked;
	};

	/**
	 * عنوان کار اصلی را تعیین می‌کند. این عنوان در نمایش به کار گرفته می‌شود.
	 * @memberof PProcess
	 * @param  {String} t عنوان اصلی کار
	 * @return {PProgressMonitor}  خود ساختار داده‌ای
	 */
	pProcess.prototype.setTaskName = function(t) {
		this.progress.taskName = t;
		return this;
	};

	/**
	 * عنوان وظیفه را تعیین می‌کند
	 * @memberof PProcess
	 * @return {string} عنوان وظیفه
	 */
	pProcess.prototype.taskName = function() {
		return this.progress.taskName;
	};

	/**
	 * عنوان کار جاری را تعیین می‌کند. در این مدل فرض کرده‌ایم که هر کار از چندین زیر وظیفه
	 * تشکیل می‌شود که در دوره‌های زمانی به صورت پشت سر هم انجام می‌شوند.
	 * @memberof PProcess
	 * @param  {String} st عنوان زیر وظیفه
	 * @return {PProcess}    خود ساختار داده‌ای پیشرفت کار.
	 */
	pProcess.prototype.setSubTask = function(st) {
		this.progress.subTask = st;
		return this;
	};

	/**
	 * عنوان زیر وظیفه‌ای را تعیین می‌کند که در حال اجرا است.
	 * @memberof PProcess
	 * @return {string} عنوان زیر وظیفه
	 */
	pProcess.prototype.subTask = function(){
		return this.progress.subTask;
	};

	return pProcess;
});
