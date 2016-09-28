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
 * @name $book
 * @memberof pluf
 * 
 * @description این سرویس امکانات مدیریت صفحه‌ها و کتاب‌های ویکی را فراهم
 *              می‌کند. با استفاده از این سرویس می‌توان صفحات و کتاب‌های ویکی را
 *              ایجاد، حذف، جستجو و یا دریافت کرد.
 */
.service(
		'$book',
		function($http, $httpParamSerializerJQLike, $q, PBook, PaginatorPage,
				PObjectCache) {

			var postct = 'application/x-www-form-urlencoded';
			var _cache = new PObjectCache(function(data) {
				return new PBook(data);
			});
			this._cache = _cache;

			/* فراخوانی‌های عمومی */
			/**
			 * کتاب‌های ویکی را با توجه به پارامتر p مورد جستجو قرار می‌دهد و
			 * نتیجه را در قالب یک فهرست صفحه‌بندی شده به صورت غیرهمزمان
			 * برمی‌گرداند. پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای
			 * کتاب‌های مورد جستجو تعیین می‌شود.
			 * 
			 * @memberof $book
			 * @param {PaginatorParameter}
			 *            p ساختاری که در آن خصوصیات مورد نظر برای کتاب‌های مورد
			 *            جستجو تعیین می‌شود.
			 * @return {promise(PaginatorPage<PWikiBook>)} ساختاری صفحه‌بندی
			 *         شده از کتاب‌ها در نتیجه جستجو
			 */
			this.books = function(pagParam) {
				var param = {};
				if (pagParam) {
					param = pagParam.getParameter();
				}
				return $http({
					method : 'GET',
					url : '/api/book/find',
					params : pagParam,
				}).then(function(res) {
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var item = page.items[i];
						item = _cache.restor(item.id, item);
						items.push(item);
					}
					page.items = items;
					return page;
				});
			};

			/**
			 * کتاب با شناسه داده شده را برمی گرداند.
			 * 
			 * @memberof $help
			 * @param {Integer}
			 *            id شناسه کتاب مورد نظر
			 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب با شناسه داده شده
			 */
			this.book = function(id) {
				if (_cache.contains(id)) {
					var deferred = $q.defer();
					deferred.resolve(_cache.get(id));
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/book/' + id,
				}).then(function(res) {
					return _cache.restor(res.data.id, res.data);
				});
			};

			/**
			 * یک کتاب را بر اساس اطلاعات داده شده ایجاد می‌کند و کتاب ایجاد شده
			 * را به صورت غیرهمزمان برمی‌گرداند.
			 * 
			 * @memberof $help
			 * @param {PWikiBook}
			 *            b کتابی که باید ذخیره شود
			 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب پس از ذخیره شدن
			 */
			this.newBook = function(bookDetail) {
				return $http({
					method : 'POST',
					url : '/api/book/new',
					data : $httpParamSerializerJQLike(bookDetail),
					headers : {
						'Content-Type' : postct
					}
				}).then(function(res) {
					return _cache.restor(res.data.id, res.data);
				});
			};
		});
