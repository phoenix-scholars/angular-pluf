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
 * @name PObjectFactory
 * 
 */
.factory('PObjectFactory', function() {
    /**
     * این فراخوانی یک نمونه جدید از این موجودیت ایجاد کرده و مقادیر داده ورودی
     * را به عنوان داده‌های این موجودیت قرار می‌دهد.
     * 
     * @memberof PObject
     * @param {data}
     *                ساختار داده‌ای موجودیت مورد نظر
     */
    var pObjectFactory = function(factory) {
	this.factory = factory;
    };

    /*
     * اطلاعات یک کاربر با شناسه تعیین شده را بازیابی می‌کند. این مقدار ممکن است
     * تهی باشد.
     */
    pObjectFactory.prototype.get = function() {
	return null;
    };

    /*
     * اطلاعات یک کاربر را بازیابی می‌کند
     */
    pObjectFactory.prototype.restor = function(id, data) {
	data.id = id;
	var instance = this.factory(data);
	return instance;
    };

    /**
     * تعیین می‌کنه که موجودیتی با شناسه تعیین شده در کش هست
     * 
     * @param {integer}
     *                شناسه موجودیت مورد نظر
     */
    pObjectFactory.prototype.contains = function() {
	return false;
    };

    return pObjectFactory;
});
