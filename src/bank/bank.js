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
 * @name $bank
 * @description
 * 
 * سرویس انجام کارهای بانکی.
 * 
 * مهم‌ترین کاری که برای این سرویس در نظر گرفته شده است ایجاد یک پرداخت جدید در
 * سیستم است.
 * 
 * <pre><code>
 * // اجرای دستور
 * $bank.receipt({...}).then(function(receipt) {
 * 	// handle new receipt
 * });
 * </code></pre>
 * 
 * بعد از اینکه پرداخت در سیستم ایجاد شد کاربر می تونه برای پرداخت آن از درگاه
 * تعیین شده اقدام کنه.
 * 
 * Gate way link is placed in receipt.
 * 
 * <pre><code>
 * $bank.receipt({...}).then(function(receipt) {
 * 	var ulr = receipt.callUrl;
 * });
 * </code></pre>
 * 
 * Users must go to callUrl to pay.
 * 
 * A receipt is accessable with secure_id.
 * 
 */
.service(
		'$bank',
		function($http, $q, PaginatorPage, PBank, PGate, PReceipt,$httpParamSerializerJQLike, PObjectCache) {
			
			var _banksCache = new PObjectCache(function(data) {
				return new PBank(data);
			});
			
			var _gateCache = new PObjectCache(function(data) {
				return new PBank(data);
			});
			var _receiptCache = new PObjectCache(function(data) {
				return new PBank(data);
			});
			

			// TODO: maso, 1395: add to PObject
			function _paginatorParams(paginatorParam) {
				if (angular.isUndefined(paginatorParam) || !angular.isFunction(paginatorParam.getParameter)) {
					return {};
				}
				return paginatorParam.getParameter();
			}
			

			
			/**
			 * Creates new receipt
			 * 
			 * @memberof $bank
			 * @return Promise<PReceipt>
			 * createdreceipt
			 * 
			 */
			this.createReceipt = function(receipt) {
				return $http({
					method: 'POST',
					url: '/api/bank/receipt/new',
					data : $httpParamSerializerJQLike(receipt),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					return _receiptCache.restor(res.data.id, res.data);
				});
			};

			/**
			 * Gets receipt detail by secure id
			 * 
			 * @memberof $bank
			 * @return Promise<PReceipt>
			 * createdreceipt
			 * 
			 */
			this.receipt = function(id) {
				if(_receiptCache.contains(id)){
					var deferred = $q.defer();
					deferred.resolve(_receiptCache.get(id));
					return deferred.promise;
				}
				return $http.get('/api/bank/receipt/'+id)//
				.then(function(res){
					return _receiptCache.restor(res.data.id, res.data);
				});
			};

			/**
			 * Lists all receipts
			 * 
			 * @memberof $bank
			 * @return Promise<PaginatorPage<PReceipt>>
			 * createdreceipt
			 * 
			 */
			this.receipts = function(paginatorParam) {
				return $http({
					method : 'GET',
					url : '/api/bank/receipt/find',
					params : _paginatorParams(paginatorParam)
				}).then(
						function(res) {
							var data = res.data;
							var page = new PaginatorPage(data);
							page.items = [];
							for (var i = 0; i < data.counts; i++) {
								var item = data.items[i];
								page.items.push(_receiptCache.resotr(
										item.id, item));
							}
							return page;
						});
			};

			/**
			 * Creates new gate
			 * 
			 * @memberof $bank
			 * @return Promise<PGate> created gate
			 */
			this.createGate = function(gate) {
				return $http({
					method: 'POST',
					url: '/api/bank/backend/new',
					data : $httpParamSerializerJQLike(gate),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					return _gateCache.restor(res.data.id, res.data);
				});
			};

			/**
			 * Gets a gate
			 * 
			 * @memberof $bank
			 * @return Promise<PGate> a gate
			 */
			this.gate = function(id) {
				if(_gateCache.contains(id)){
					var deferred = $q.defer();
					deferred.resolve(_gateCache.get(id));
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/bank/backend/'+id,
				}).then(function(res){
					return _gateCache.restor(res.data.id, res.data);
				});
			};

			/**
			 * Lists all gates
			 * 
			 * @memberof $bank
			 * @param paginatorParam
			 * @return Promise<PaginatorPage<PGate>> gates list
			 */
			this.gates = function(paginatorParam) {
				return $http({
					method : 'GET',
					url : '/api/bank/backend/find',
					params : _paginatorParams(paginatorParam)
				}).then(
						function(res) {
							var data = res.data;
							var page = new PaginatorPage(data);
							page.items = [];
							for (var i = 0; i < data.counts; i++) {
								var item = data.items[i];
								page.items.push(_gateCache.restor(
										item.id, item));
							}
							return page;
						});
			};

			/**
			 * Gets bank detail
			 * 
			 * @memberof $bank
			 * @return Promise<PBank>
			 */
			this.bank = function(type) {
				if(_banksCache.contains(type)){
					var deferred = $q.defer();
					deferred.resolve(_banksCache.get(type));
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/bank/engine/'+type,
				}).then(function(res){
					return _banksCache.restor(res.data.type, res.data);
				});
			};
			
			/**
			 * Gets bank list
			 * 
			 * 
			 * @memberof $bank
			 * @return Promise<PaginatorPage<PGate>> gates list
			 */
			this.banks = function(paginatorParam) {
				return $http({
					method : 'GET',
					url : '/api/bank/engine/find',
					params : _paginatorParams(paginatorParam)
				})//
				.then(
						function(res) {
							var data = res.data;
							var page = new PaginatorPage(data);
							page.items = [];
							for (var i = 0; i < data.counts; i++) {
								var item = data.items[i];
								page.items.push(_banksCache.restor(
										item.type, item));
							}
							return page;
						});
			};

		});