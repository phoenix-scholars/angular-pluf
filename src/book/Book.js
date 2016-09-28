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
 * @name PWikiBook
 * @memberof wiki
 * 
 * @description ساختار داده‌ای یک کتاب به همراه اطلاعات کامل صفحه.
 * 
 * @attr {Integer} id شناسه کتاب
 * @attr {String} title عنوان کتاب
 * @attr {String} state وضعیت کتاب
 * @attr {String} language زبان مورد استفاده در متن صفحات کتاب
 * @attr {String} summary خلاصه یا توضیحی کوتاه در مورد کتاب
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد کتاب
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory(
		'PBook',
		function(PObject, PaginatorPage, $http, $httpParamSerializerJQLike, $q,
				PPage) {

			var pBook = function() {
				PObject.apply(this, arguments);
			};
			pBook.prototype = new PObject();

			/**
			 * فهرستی از صفحات کتاب را برمی‌گرداند
			 * 
			 * @memberof PWikiBook
			 * @returns {promise(PaginatedPage<PWikiPageItem>)} فهرستی صفحه
			 *          بندی شده از PageItem های مربوط به صفحات کتاب
			 */
			pBook.prototype.pages = function() {
				return $http({
					method : 'GET',
					url : '/api/book/' + this.id + '/page/find',
				}).then(function(res) {
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var item = page.items[i];
						items.push(new PPage(item));
					}
					page.items = items;
					return page;
				});
			};

			/**
			 * یک صفحه را به کتاب اضافه می‌کند
			 * 
			 * @memberof PWikiBook
			 * @param {PWikiPage}
			 *            page صفحه‌ای که به کتاب اضافه خواهد شد
			 * @returns {promise(PWikiBook)} خود کتاب را که صفحه جدید به آن
			 *          اضافه شده است برمی‌گرداند
			 */
			pBook.prototype.newPage = function(bookDetail) {
				return $http({
					method : 'POST',
					url : '/api/book/' + this.id + '/page/new',
					data : $httpParamSerializerJQLike(bookDetail)
				}).then(function(res) {
					return new PPage(res.data);
				});
			};

			/**
			 * یک صفحه را از کتاب حذف می‌کند
			 * 
			 * @memberof PWikiBook
			 * @param {PWikiPage}
			 *            page صفحه‌ای که باید از کتاب حذف شود
			 * @returns {promise(PWikiPage)} صفحه حذف شده از کتاب را برمی‌گرداند
			 */
			pBook.prototype.page = function(id) {
				return $http({
					method : 'POST',
					url : '/api/book/' + this.id + '/page/' + id,
				}).then(function(res) {
					return new PPage(res.data);
				});
			};

			/**
			 * اطلاعات یک کتاب را به‌روزرسانی می‌کند.
			 * 
			 * @memberof PWikiBook
			 * @param {struct}
			 *            b ساختاری حاوی اطلاعاتی از کتاب که باید به‌روزرسانی
			 *            شود
			 * @returns {promise(PWikiBook)} کتاب با اطلاعات به‌روزرسانی شده
			 */
			pBook.prototype.update = function() {
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/book/' + scope.id,
					data : $httpParamSerializerJQLike(this),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(res) {
					scope.setData(res.data);
					return scope;
				});
			};

			/**
			 * کتاب را حذف می‌کند
			 * 
			 * @memberof PWikiBook
			 * @returns {promise(PWikiBook)} کتاب حذف شده
			 */
			pBook.prototype.remove = function() {
				var scope = this;
				return $http({
					method : 'DELETE',
					url : '/api/book/' + scope.id
				}).then(function(res) {
					scope.setData(res.data);
					return scope;
				});
			};

			return pBook;
		});
