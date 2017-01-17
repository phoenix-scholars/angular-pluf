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
 * @ngdoc service
 * @name $saas
 * @memberof pluf.saas
 * @description مدیریت ملک و نرم افزارها را انجام می‌دهد.
 */
.service('$saas', function($http, PTenant, PSpa, PObjectCache, $pluf) {

	var _tenantCache = new PObjectCache(function(data) {
		return new PTenant(data);
	});

	var _spaCache = new PObjectCache(function(data) {
		return new PSpa(data);
	});

	/**
	 * نمونه جاری را تعیین می‌کند. به صورت پیش فرض اجرای هر نرم افزار روی یک ملک
	 * اجرا می‌شود این فراخوانی ملکی را تعیین می‌کند که نرم افزار جاری روی آن
	 * کار می‌کند.
	 * 
	 * @memberof $saas
	 * @return {permision(PTenant)} ملک جاری را تعیین می‌کند.
	 */
	this.session = function() {
		return $http.get('/api/tenant')//
		.then(function(res) {
			return _tenantCache.restor(res.data.id, res.data);
		});
	};

	/**
	 * فهرست تمام ملک‌هایی را که کاربر به آنها دسترسی دارد را تعیین می‌کند.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *            paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} فهرست ملک‌ها به صورت صفحه
	 *         بندی
	 */
	this.tenants = $pluf.createFind({
		method : 'GET',
		url : '/api/tenant/find',
	}, _tenantCache);

	/**
	 * ملک تعیین شده با شناسه را برمی‌گرداند.
	 * 
	 * @memberof $saas
	 * @param {integer}
	 *            id شناسه ملک مورد نظر
	 * @return {promise<PTenant>} ملک تعیین شده.
	 */
	this.tenant = $pluf.createGet({
		url : '/api/tenant/{id}',
		method : 'GET'
	}, _tenantCache);

	/**
	 * یک ملک جدید ایجاد می‌کند و ساختار ایجاد شده برای آنرا به عنوان نتیجه
	 * برمی‌گرداند.
	 * 
	 * @memberof $saas
	 * @param {Struct}
	 *            tenantData ساختار داده‌ای ملک
	 * @return {promise<PTenant>} مکل ایجاد شده
	 */
	this.newTenant = $pluf.createNew({
		method : 'POST',
		url : '/api/tenant/new',
	}, _tenantCache);

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *            paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم افزارها
	 */
	this.spas = $pluf.createFind({
		method : 'GET',
		url : '/api/spa/find',
	}, _spaCache);

	/**
	 * نرم افزار معادل با شناسه ورودی را بازیابی می‌کند.
	 * 
	 * @memberof $saas
	 * @param {integer}
	 *            id شناسه نرم افزار
	 * @return {promise<PSpa>} نرم‌افزار معادل
	 */
	this.spa = $pluf.createGet({
		url : '/api/spa/{id}',
		method : 'GET'
	}, _spaCache);

	/**
	 * یک نرم افزار جدید در سیستم ایجاد می‌کند.
	 * 
	 * @memberof $saas
	 * @param {Struct}
	 *            spa ساختار داده‌ای یک spa
	 * @return {promise<PSpa} نرم‌افزار معادل ایجاد شده
	 */
	this.newSpa = function(file) {
		var fd = new FormData();
		fd.append('file', file);
		return $http.post('/api/spa/new', fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		})//
		.then(function(res) {
			return new PSpa(res.data);
		});
	};

});
