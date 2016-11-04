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
.service('$monitor', function($q, $timeout, $pluf, PMonitor, PObjectFactory) {
    /*
     * فهرستی از تمام مانیتورهای تعریف شده را نگهداری می ‌کند
     */
    var _monitors = [];

    var _interval = 3000;
    
    var _cache = new PObjectFactory(function(data) {
	return new this.PMonitor(data);
    });
    
    function reaload(){
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
     * 	.then(function(monitor) {
     * 	    // Do something with monitor
     * 	    });
     * </code></pre>
     * 
     * @memberof $monitor
     * @param {string}
     *                bean
     * @param {string}
     *                property
     * @return {promise(PMonitor)}
     */
    this.monitor = function(bean, property) {
	var def = $q.defer();
	$timeout(function() {
	    var monitor = null;
	    angular.forEach(_monitors, function(element) {
		if (element.bean === bean && element.property == property) {
		    monitor = element;
		}
	    });
	    if(monitor){
		def.resolve(monitor);
		return;
	    }
	    monitor = new PMonitor();
	    monitor//
	    .setBean(bean)//
	    .setProperty(property);
	    _monitors.push(monitor);
	    def.resolve(monitor);
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
     *                monitor
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

});
