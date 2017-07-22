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
 * @ngdoc service
 * @name $monitor
 * @description مدیریت تمام مانیتورها را ایجاد می‌کند
 * 
 * مانیتورها در واحد زمان باید به روز شوند. این سرویس نه تنها مانیتورها را ایجاد
 * بلکه آنها را در واحد زمان به روز می‌کند.
 * 
 * در صورتی که استفاده از یک مانیتور تمام شود،‌این سرویس مانیتورهای ایجاد شده را
 * حذف می‌کند تا میزان انتقال اطلاعات را کم کند.
 * 
 * @see PMonitor
 * 
 */
.service('$monitor', function($q, $timeout, $pluf, PMonitor, PMonitorProperty, PObjectFactory) {
	/*
	 * فهرستی از تمام مانیتورهای تعریف شده را نگهداری می ‌کند
	 */
	var _monitors = [];

	// XXX: maso, 1395: فعلا زیاد در نظر گرفتم تا ساختار سرور نهایی بشه
	var _interval = 60000;

	var _cache = new PObjectFactory(function(data) {
		return new this.PMonitor(data);
	});

	function reaload(){
		// XXX: maso, 1395: handle monitor interval
		if(_monitors.length == 0){
			$timeout(reaload, _interval);
			return;
		}
		var promises = [];
		for(var i = 0; i < _monitors.length; i++){
			var monitor = _monitors[i];
			promises.push(monitor.refresh());
		}
		return $q.all(promises)//
		.finally(function(){
			$timeout(reaload, _interval);
		});
	};

	/**
	 * مانیتور معادل را تعیین می‌کند
	 * 
	 * با این فراخوانی مانیتور معادل ایجاد شده و به عنوان نتیجه برگردانده
	 * می‌شود.
	 * 
	 * <pre><code>
	 * $monitor.monitor('user', 'owner')//
	 * 		.then(function(monitor) {
	 * 			// Do something with monitor
	 * 			});
	 * </code></pre>
	 * 
	 * @memberof $monitor
	 * @param {string}
	 *            bean
	 * @param {string}
	 *            property
	 * @return {promise(PMonitor)}
	 */
	this.monitor = function(monitor, property) {
		var def = $q.defer();
		$timeout(function() {
			var m = null;
			angular.forEach(_monitors, function(element) {
				if (element.monitor === monitor && element.property == property) {
					m = element;
				}
			});
			if(m){
				def.resolve(m);
				return;
			}
			m = new PMonitorProperty();
			m.monitor = monitor;
			m.id = property;
			_monitors.push(m);
			def.resolve(m);
		}, 1);
		return def.promise;
	};

	/**
	 * فهرستی از تمام مانیتورها
	 */
	this.monitors = $pluf.createFind({
		method : 'GET',
		url : '/api/monitor/find',
	}, _cache);

	/**
	 * حدف یک مانیتور
	 * 
	 * @param {Object}
	 *            monitor
	 */
	this.distroy = function(monitor) {
		var def = $q.defer();
		$timeout(function() {
			// XXX: maso, 1395: remove monitor
			def.resolve(monitor);
		}, 1);
		return def.promise;
	};

	reaload();
	
	/**
	 * Query data
	 * 
	 * Query language expressions may be evaluated at a single instant or over a
	 * range of time. The sections below describe the API endpoints for each
	 * type of expression query.
	 * 
	 * URL query parameters:
	 * <ul>
	 * <li>query=<string>: Prometheus expression query string.</li>
	 * <li>time=<rfc3339 | unix_timestamp>: Evaluation timestamp. Optional.</li>
	 * <li>timeout=<duration>: Evaluation timeout. Optional. Defaults to and
	 * is capped by the value of the -query.timeout flag.</li>
	 * </ul>
	 * The current server time is used if the time parameter is omitted.
	 * 
	 * The data section of the query result has the following format:
	 * 
	 * <pre><code>
	 * {
	 *   resultType: matrix | vector | scalar | string,
	 *   result: value&gt;
	 * }
	 * </code></pre>
	 * 
	 * <value> refers to the query result data, which has varying formats
	 * depending on the resultType
	 */
	this.query = $pluf.get({
		url: '/api/v1/query'
	});
	
	/**
	 * Query range data
	 * 
	 * The following endpoint evaluates an expression query over a range of
	 * time:
	 * 
	 * <ul>
	 * <li></li>
	 * <li>query=<string>: Prometheus expression query string.</li>
	 * <li>start=<rfc3339 | unix_timestamp>: Start timestamp.</li>
	 * <li>end=<rfc3339 | unix_timestamp>: End timestamp.</li>
	 * <li>step=<duration>: Query resolution step width.</li>
	 * <li>timeout=<duration>: Evaluation timeout. Optional. Defaults to and
	 * is capped by the value of the -query.timeout flag.</li>
	 * </ul>
	 * The data section of the query result has the following format:
	 * 
	 * <pre><code>
	 * {
	 * 	resultType : matrix,
	 * 	result : value
	 * }
	 * </code></pre>
	 * 
	 * For the format of the <value> placeholder, see the range-vector result
	 * format.
	 * 
	 * The following example evaluates the expression up over a 30-second range
	 * with a query resolution of 15 seconds.
	 */
	this.queryRange = $pluf.get({
		url: '/api/v1/query_range'
	});

});
