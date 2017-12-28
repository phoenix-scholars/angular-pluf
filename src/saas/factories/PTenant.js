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
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenant
 * @description ساختار داده‌ای یک ملک را تعیین کرده و امکاناتی برای مدیریت ملک فراهم میکند
 * 
 * این سرویس مدیریت ملک، نرم افزارها و پرداخت‌های مربوط به ملک را انجام می‌دهد. بسته به اینکه ملک چه دسترسی‌هایی داشته باشد
 * نتیجه هر فراخوانی ممکن است متفاوت باشد. یا حتی برخی فراخوانی‌ها ممکن است برای یک ملک مجاز نباشد و با خطا مواجه شود.
 * به عنوان مثال یک ملک ممکن است امکان مدیریت برخی اعمال مربوط به سایر ملک‌ها را داشته
 * باشد (به عبارتی ملک یک ابرملک باشد).
 */
.factory('PTenant', function($pluf, $injector, PObject, PObjectFactory, PInvoice) {

	var _invoiceCache = new PObjectFactory(function(data) {
		return new PInvoice(data);
	});
	
	var pTenant = function() {
		PObject.apply(this, arguments);
	};
	pTenant.prototype = new PObject();

	/**
	 * یک ملک را حذف می‌کند
	 * 
	 * @memberof PTenant
	 * @return {promise<PTenant>} ملک حذف شده
	 */
	pTenant.prototype.delete = $pluf.createDelete({
		method : 'DELETE',
		url : '/api/saas/tenant/current'
	});

	/**
	 * اطلاعات ملک را به روز می‌کند
	 * 
	 * @memberof PTenant
	 * @return {promise<PTenant>} خود ملک
	 */
	pTenant.prototype.update =  $pluf.createUpdate({
		method : 'POST',
		url : '/api/saas/tenant/current',
	});

	/**
	 * تعیین نرم افزار پیش‌فرض
	 * 
	 * نرم افزار پیش‌فرض برای سیستم را تعیین می‌کند.
	 * 
	 * @memberof PTenant
	 * @param {PSpa}
	 *                spa
	 * @return {promise{tenant}}
	 */
	pTenant.prototype.defaultSpa = function(spa){
		var $saas = $injector.get('$saas');
		return $saas.setting('spa.default', spa.name);
	}
	
	/**
	 * فهرست تمام فاکتورهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 * 
	 * @memberof $saas
	 * @param {PaginatorParameter}
	 *                paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PInvoice>>} فهرست فاکتورهای ملک جاری
	 */
	pTenant.prototype.invoices = $pluf.createFind({
		method : 'GET',
		url : '/api/saas/tenant/:id/invoice/find',
	}, _invoiceCache);
	
	/**
	 * یک فاکتور اجاره ملک جدید ایجاد می‌کند و ساختار ایجاد شده برای آنرا به عنوان نتیجه
	 * برمی‌گرداند.
	 * 
	 * @memberof $saas
	 * @param {Struct}
	 *                tenantData ساختار داده‌ای فاکتور اجاره ملک
	 * @return {promise<PInvoice>} فاکتور اجاره ملک ایجاد شده
	 */
	pTenant.prototype.newInvoice = $pluf.createNew({
		method : 'POST',
		url : '/api/saas/tenant/:id/invoice/new',
	}, _invoiceCache);
	
	return pTenant;
});
