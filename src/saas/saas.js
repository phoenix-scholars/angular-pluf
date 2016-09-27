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
		.service(
				'$saas',
				function($http, $httpParamSerializerJQLike, $q, $window, $act,
						$usr, PTenant, PSpa, PaginatorParameter, PaginatorPage,
						PObjectCache) {
					var contentType = 'application/x-www-form-urlencoded';

					var _tenantCache = new PObjectCache(function(data) {
						return new PTenant(data);
					});

					var _spaCache = new PObjectCache(function(data) {
						return new PSpa(data);
					});

					/**
					 * نمونه جاری را تعیین می‌کند. به صورت پیش فرض اجرای هر نرم
					 * افزار روی یک ملک اجرا می‌شود این فراخوانی ملکی را تعیین
					 * می‌کند که نرم افزار جاری روی آن کار می‌کند.
					 * 
					 * @memberof $saas
					 * @return {permision(PTenant)} ملک جاری را تعیین می‌کند.
					 */
					this.session = function() {
						return $http.get('/api/tenant')//
						.then(function(res) {
							return _tenantCache.restor(res.data);
						});
					};

					/**
					 * فهرست تمام ملک‌هایی را که کاربر به آنها دسترسی دارد را
					 * تعیین می‌کند.
					 * 
					 * @memberof $saas
					 * @param {PaginatorParameter}
					 *            paginatorParameter پارامترهای مورد استفاده در
					 *            صفحه بندی
					 * @return {promise<PaginatorPage<PTenant>>} فهرست ملک‌ها
					 *         به صورت صفحه بندی
					 */
					this.tenants = function(paginatorParameter) {
						var param = {};
						if (paginatorParameter) {
							param = paginatorParameter.getParameter();
						}
						return $http({
							method : 'GET',
							url : '/api/tenant/find',
							params : param
						}).then(
								function(res) {
									var page = new PaginatorPage(res.data);
									page.items = [];
									for (var i = 0; i < page.counts; i++) {
										var item = res.data.items[i];
										page.items.push(_tenantCache.restor(
												item.id, item));
									}
									return page;
								});
					};

					/**
					 * ملک تعیین شده با شناسه را برمی‌گرداند.
					 * 
					 * @memberof $saas
					 * @param {integer}
					 *            id شناسه ملک مورد نظر
					 * @return {promise<PTenant>} ملک تعیین شده.
					 */
					this.tenant = function(id) {
						if (_tenantCache.contains(id)) {
							var deferred = $q.defer();
							deferred.resolve(_tenantCache.get(id));
							return deferred.promise;
						}
						return $http.get('/api/tenant/' + id)//
						.then(function(res) {
							return _tenantCache.restor(res.data.id, res.data);
						});
					};

					/**
					 * یک ملک جدید ایجاد می‌کند و ساختار ایجاد شده برای آنرا به
					 * عنوان نتیجه برمی‌گرداند.
					 * 
					 * @memberof $saas
					 * @param {Struct}
					 *            tenantData ساختار داده‌ای ملک
					 * @return {promise<PTenant>} مکل ایجاد شده
					 */
					this.newTenant = function(t) {
						return $http({
							method : 'POST',
							url : '/api/tenant/new',
							data : $httpParamSerializerJQLike(t),
							headers : {
								'Content-Type' : contentType
							}
						})//
						.then(function(res) {
							return _tenantCache.restor(res.data.id, res.data);
						});
					};

					/**
					 * فهرست تمام نرم افزارهایی را تعیین می‌کند که برای ملک جاری
					 * در دسترس است.
					 * 
					 * @memberof $saas
					 * @param {PaginatorParameter}
					 *            paginatorParameter پارامترهای مورد استفاده در
					 *            صفحه بندی
					 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم
					 *         افزارها
					 */
					this.spas = function(paginatorParameter) {
						var param = {};
						if (paginatorParameter) {
							param = paginatorParameter.getParameter();
						}
						return $http({
							method : 'GET',
							url : '/api/spa/find',
							params : param
						})//
						.then(
								function(res) {
									var page = new PaginatorPage(res.data);
									page.items = [];
									for (var i = 0; i < page.counts; i++) {
										var item = res.data.items[i];
										page.items.push(_spaCache.restore(
												item.id, item));
									}
									return page;
								});
					};

					/**
					 * نرم افزار معادل با شناسه ورودی را بازیابی می‌کند.
					 * 
					 * @memberof $saas
					 * @param {integer}
					 *            id شناسه نرم افزار
					 * @return {promise<PSpa>} نرم‌افزار معادل
					 */
					this.spa = function(id) {
						if (_spaCache.contains(id)) {
							var deferred = $q.defer();
							deferred.resolve(_spaCache.get(id));
							return deferred.promise;
						}
						return $http.get('/api/spa/' + id)//
						.then(function(res) {
							return _spaCache.restor(res.data.id, res.data);
						});
					};

					/**
					 * یک نرم افزار جدید در سیستم ایجاد می‌کند.
					 * 
					 * @memberof $saas
					 * @param {Struct}
					 *            spa ساختار داده‌ای یک spa
					 * @return {promise<PSpa} نرم‌افزار معادل ایجاد شده
					 */
					this.newSpa = function(detail) {
						return $http({
							method : 'POST',
							url : '/api/spa/new',
							data : $httpParamSerializerJQLike(detail),
							headers : {
								'Content-Type' : contentType
							}
						})//
						.then(function(res) {
							return _spaCache.restor(res.data.id, res.data);
						});
					};
				});
