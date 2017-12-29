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
 * 
 * این سرویس مدیریت ملک، نرم افزارها و پرداخت‌ها را انجام می‌دهد. بسته به اینکه ملک جاری چه دسترسی‌هایی داشته باشد
 * نتیجه هر فراخوانی ممکن است متفاوت باشد. یا حتی برخی فراخوانی‌ها ممکن است برای یک ملک مجاز نباشد و با خطا مواجه شود.
 * به عنوان مثال یک ملک ممکن است امکان مدیریت برخی اعمال مربوط به سایر ملک‌ها را داشته
 * باشد (به عبارتی ملک یک ابرملک باشد).
 */
.service('$saas', function($http, PTenant, PSpa, PInvoice, PSaasGate, PSaasReceipt, 
		PObjectFactory, PObjectCache, $pluf, $httpParamSerializerJQLike) {

	var _tenantCache = new PObjectFactory(function(data) {
		return new PTenant(data);
	});

	var _spaCache = new PObjectFactory(function(data) {
		return new PSpa(data);
	});

	var _invoiceCache = new PObjectCache(function(data) {
		return new PInvoice(data);
	});

	var _gateCache = new PObjectCache(function(data) {
		return new PSaasGate(data);
	});

	var _receiptCache = new PObjectCache(function(data) {
		return new PSaasReceipt(data);
	});

	/**
	 * ملک جاری را تعیین می‌کند. به صورت پیش فرض اجرای هر نرم افزار روی یک ملک
	 * اجرا می‌شود این فراخوانی ملکی را تعیین می‌کند که نرم افزار جاری روی آن
	 * کار می‌کند.
	 * 
	 * @memberof $saas
	 * @return {permision(PTenant)} ملک جاری را تعیین می‌کند.
	 */
	this.session = function() {
		return $http.get('/api/saas/tenant/current')//
		.then(function(res) {
			res.data.id = 'current';
			return _tenantCache.restor(res.data.id, res.data);
		});
	};

	/**
	 * همان تابع session() است که ملک جاری را برمی‌گرداند
	 * @see session()
	 */
	this.currentTenant = this.session;

	/**
	 * ملک جاری یا ملک تعیین شده با شناسه را برمی‌گرداند.
	 * در صورتی که شناسه یک ملک به عنوان ورودی به این تابع داده شود، ملک با شناسه داده شده
	 * برگردانده می‌شود. در صورتی که شناسه‌ای به عنوان ورودی داده نشود ملک جاری برگردانده می‌شود.
	 * 
	 * @memberof $saas
	 * @param {integer|null}
	 *                id شناسه ملک مورد نظر
	 * @return {promise<PTenant>} ملک تعیین شده.
	 */
	this.tenant = function (id){
		var myId = id ? id : 'current';
		return $pluf.createGet({
			url : '/api/saas/tenant/' + myId,
			method : 'GET'
		}, _tenantCache)();
	};

	/**
	 * فهرست تمام ملک‌هایی را که کاربر به آنها دسترسی دارد را تعیین می‌کند.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *                paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} فهرست ملک‌ها به صورت صفحه
	 *         بندی
	 */
	this.tenants = $pluf.createFind({
		method : 'GET',
		url : '/api/saas/tenant/find',
	}, _tenantCache);

	/**
	 * یک ملک جدید ایجاد می‌کند و ساختار ایجاد شده برای آنرا به عنوان نتیجه
	 * برمی‌گرداند.
	 * 
	 * @memberof $saas
	 * @param {Struct}
	 *                tenantData ساختار داده‌ای ملک
	 * @return {promise<PTenant>} مکل ایجاد شده
	 */
	this.newTenant = $pluf.createNew({
		method : 'POST',
		url : '/api/saas/tenant/new',
	}, _tenantCache);

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *                paginatorParameter پارامترهای مورد استفاده در صفحه بندی
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
	 *                id شناسه نرم افزار
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
	 *                spa ساختار داده‌ای یک spa
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

	/**
	 * Sets or Gets setting value
	 * 
	 * Each teanant is contains of severall settings. This method allow you to
	 * set or get value.
	 * 
	 * <code>
	 * 	$saas.setting('key', 'value')//
	 * 		.then(function(){
	 * 			// value is set
	 * 		});
	 * </code>
	 * 
	 * And getting the value:
	 * 
	 * <code>
	 * 	$saas.setting('key')//
	 * 		.then(function(value){
	 * 			// access value
	 * 		});
	 * </code>
	 */
	this.setting = function(key, value) {
		if (angular.isDefined(value)) {
			// Setting value
			return $http({
				method : 'POST',
				url : '/api/setting/spa.default',
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				},
				data : $httpParamSerializerJQLike({
					'value' : value
				})
			})
		}
		// getting value
		return $http({
			method : 'GET',
			url : '/api/setting/spa.default'
		}).then(function(res) {
			return res.data.value;
		});
	}

	/**
	 * فهرست تمام فاکتورهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *                paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PInvoice>>} فهرست فاکتورهای ملک جاری
	 */
	this.invoices = $pluf.createFind({
		method : 'GET',
		url : '/api/saas/invoice/find',
	}, _invoiceCache);

	/**
	 * فاکتور تعیین شده با شناسه را برمی‌گرداند.
	 * 
	 * @memberof $saas
	 * @param {integer}
	 *                id شناسه فاکتور اجاره ملک مورد نظر
	 * @return {promise<PInvoice>} فاکتور اجاره ملک تعیین شده.
	 */
	this.invoice = $pluf.createGet({
		url : '/api/saas/invoice/{id}',
		method : 'GET'
	}, _invoiceCache);


	/**
	 * Gets a saas-gate
	 * 
	 * @memberof $saas
	 * @return Promise<PSaasGate> a saas-gate
	 */
	this.gate = $pluf.createGet({
		method : 'GET',
		url : '/api/saas/backend/{id}',
	}, _gateCache);

	/**
	 * Lists all saas-gates
	 * 
	 * @memberof $saas
	 * @param paginatorParam
	 * @return Promise<PaginatorPage<PSaasGate>> gates list
	 */
	this.gates = $pluf.createFind({
		method : 'GET',
		url : '/api/saas/backend/find',
	}, _gateCache);


	/**
	 * Gets saas-receipt detail by id or secure id
	 * 
	 * @memberof $bank
	 * @return Promise<PSaasReceipt> created receipt
	 * 
	 */
	this.receipt = $pluf.createGet({
		method : 'GET',
		url : '/api/saas/receipt/{id}',
	}, _receiptCache);

	/**
	 * Lists all receipts
	 * 
	 * @memberof $bank
	 * @return Promise<PaginatorPage<PSaasReceipt>> list of receipts
	 * 
	 */
	this.receipts = $pluf.createFind({
		method : 'GET',
		url : '/api/saas/receipt/find',
	}, _receiptCache);
});
