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
		function($http, $q, PaginatorPage, PBank, PGate, PReceipt,$httpParamSerializerJQLike) {
			var _banks = {};
			var _gates = {};
			var _receipts = {};

			// TODO: maso, 1395: add to PObject
			function _paginatorParams(paginatorParam) {
				if (angular.isUndefined(paginatorParam) || !angular.isFunction(paginatorParam.getParameter)) {
					return {};
				}
				return paginatorParam.getParameter();
			}
			
			// TODO: maso, 1395: replace with PObjectCache
			/*
			 * گرفتن یک محتوی
			 */
			function _bank(id) {
				return _banks[id];
			}
			/*
			 * بازیابی یک محتوی نامدار
			 */
			function _retbank(id, data) {
				var bank = _banks[id];
				if (bank) {
					bank.setData(data);
				} else {
					bank = new PBank(data);
					_banks[id] = bank;
				}
				return bank;
			}
			
			function _gate(id){
				return _gates[id];
			}

			function _retgate(id, data) {
				var gate = _gates[id];
				if (gate) {
					gate.setData(data);
				} else {
					gate = new PGate(data);
					_gates[id] = gate;
				}
				return gate;
			}
			
			function _receipt(id){
				return _receipts[id];
			}
			
			function _retreceipt(id, data) {
				var receipt = _receipts[id];
				if (receipt) {
					receipt.setData(data);
				} else {
					receipt = new PReceipt(data);
					_receipts[id] = receipt;
				}
				return receipt;
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
					return _retreceipt(res.data.id, res.data);
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
				var receipt = _receipt(id);
				if(receipt){
					var deferred = $q.defer();
					deferred.resolve(receipt);
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/bank/receipt/'+id,
				}).then(function(res){
					return _retreceipt(res.data.id, res.data);
				});
			};

			/**
			 * Gets receipt detail
			 * 
			 * @memberof $bank
			 * @return Promise<PReceipt>
			 * createdreceipt
			 * 
			 */
			this.receiptById = function(id) {
				return this.receipt(id);
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
								page.items.push(_retreceipt(
										data.items[i].type, data.items[i]));
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
					return _retgate(res.data.id, res.data);
				});
			};

			/**
			 * Gets a gate
			 * 
			 * @memberof $bank
			 * @return Promise<PGate> a gate
			 */
			this.gate = function(id) {
				var gate = _gate(id);
				if(gate){
					var deferred = $q.defer();
					deferred.resolve(gate);
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/bank/backend/'+id,
				}).then(function(res){
					return _retgate(res.data.id, res.data);
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
								page.items.push(_retgate(
										data.items[i].type, data.items[i]));
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
				var bank = _bank(type);
				if(bank){
					var deferred = $q.defer();
					deferred.resolve(bank);
					return deferred.promise;
				}
				return $http({
					method : 'GET',
					url : '/api/bank/engine/'+type,
				}).then(function(res){
					bank = _retbank(res.data.type, res.data);
					return bank;
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
				}).then(
						function(res) {
							var data = res.data;
							var page = new PaginatorPage(data);
							page.items = [];
							for (var i = 0; i < data.counts; i++) {
								page.items.push(_retbank(
										data.items[i].type, data.items[i]));
							}
							return page;
						});
			};

		});