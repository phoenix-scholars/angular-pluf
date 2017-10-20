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
.service('$collection', function($pluf, PCollection, PObjectFactory) {

	var _cache = new PObjectFactory(function(data) {
		return new PCollection(data);
	});

	/**
	 * Creates new collection
	 * 
	 * @memberof $collection
	 * @return Promise<PCollection>
	 * createdreceipt
	 * 
	 */
	this.newCollection = $pluf.createNew({
		method : 'POST',
		url : '/api/collection/new'
	}, _cache);

	/**
	 * Gets collection detail. Input could be id or name of collection.
	 * 
	 * @memberof $collection
	 * @return Promise<PCollection>
	 * createdreceipt
	 * 
	 */
	this.collection = $pluf.createGet({
		method : 'GET',
		url : '/api/collection/{id}',
	}, _cache);

	/**
	 * Lists all collections
	 * 
	 * @memberof $collection
	 * @return Promise<PaginatorPage<PCollection>>
	 * createdreceipt
	 * 
	 */
	this.collections = $pluf.createFind({
		method : 'GET',
		url : '/api/collection/find',
	}, _cache);

});
