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
 * @name $pluf
 * @description ابزارهای پایه‌ای
 */
.service('$pluf',
		function(PaginatorPage, $q, $http, $httpParamSerializerJQLike) {

			/**
			 * 
			 * @memberof $pluf
			 * @param {Object}
			 *            params
			 * @param {PObjectCache}
			 *            cache
			 * @return {function}
			 */
			this.createFind = function(params, _cache) {
				return function(paginatorParameter) {
					if (paginatorParameter) {
						params.params = paginatorParameter.getParameter();
					}
					return $http(params)//
					.then(function(res) {
						var page = new PaginatorPage(res.data);
						var items = [];
						for (var i = 0; i < page.counts; i++) {
							var item = page.items[i];
							items.push(_cache.restor(item.id, item));
						}
						page.items = items;
						return page;
					});
				};
			};

			/**
			 * 
			 * @memberof $pluf
			 * @param {Object}
			 *            params
			 * @param {PObjectCache}
			 *            cache
			 * @return {function}
			 */
			this.createGet = function(params, _cache) {
				var urlTemplate = params.url;
				return function(id) {
					if (_cache.contains(id)) {
						var deffer = $q.deffer();
						deffer.resolve(_cache.get(id));
						return deffer.promise();
					}
					params.url = urlTemplate.replace('{id}', id);
					return $http(params)//
					.then(function(res) {
						return _cache.restor(res.data.id, res.data);
					});
				};
			};

			/**
			 * 
			 * @memberof $pluf
			 * @param {Object}
			 *            params
			 * @param {PObjectCache}
			 *            cache
			 * @return {function}
			 */
			this.createNew = function(params, _cache) {
				params.headers = {
					'Content-Type' : 'application/x-www-form-urlencoded'
				};
				return function(objectData) {
					params.data = $httpParamSerializerJQLike(objectData);
					return $http(params)//
					.then(function(res) {
						return _cache.restor(res.data.id, res.data);
					});
				};
			};
		});