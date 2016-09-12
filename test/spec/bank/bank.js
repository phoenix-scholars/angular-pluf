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

describe('Bank module test: $bank', function() {
	var $bank;
	var $rootScope;
	var $httpBackend;
	var $timeout;
	var PaginatorParameter;

	beforeEach(function() {
		module('pluf');
	});

	beforeEach(function() {
		inject(function(_$bank_, _$rootScope_, _$httpBackend_, _$timeout_,
				_PaginatorParameter_) {
			$bank = _$bank_;

			// Concurent test
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
			PaginatorParameter = _PaginatorParameter_;
		});
	});

	it('Check $bank API', function() {
		// receipt functions
		expect(angular.isFunction($bank.receipt)).toBe(true);
		expect(angular.isFunction($bank.receiptById)).toBe(true);
		expect(angular.isFunction($bank.createReceipt)).toBe(true);
		expect(angular.isFunction($bank.receipts)).toBe(true);

		// gate api
		expect(angular.isFunction($bank.createGate)).toBe(true);
		expect(angular.isFunction($bank.gate)).toBe(true);
		expect(angular.isFunction($bank.gates)).toBe(true);

		// bank api
		expect(angular.isFunction($bank.bank)).toBe(true);
		expect(angular.isFunction($bank.banks)).toBe(true);
	});

	/*
	 * جستجو گرفتن بانک تست شده است.
	 */
	it('Bank find bank tests with params', function(done) {
		var pag = new PaginatorParameter();
		$bank.banks(pag).then(function(banks) {
			expect(banks).not.toBeNull();
			done();
		});

		$httpBackend.expect('GET', '/api/bank/engine/find').respond(200, {
			'items' : [],
			'counts' : 0,
			'current_page' : 0,
			'items_per_page' : 2,
			'page_number' : 1
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('Bank find bank tests without params', function(done) {
		$bank.banks().then(function(banks) {
			expect(banks).not.toBeNull();
			done();
		});

		$httpBackend.expect('GET', '/api/bank/engine/find').respond(200, {
			'items' : [],
			'counts' : 0,
			'current_page' : 0,
			'items_per_page' : 2,
			'page_number' : 1
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('Bank get bank tests', function(done) {
		var type = 'xxxx';
		$bank.bank(type)//
		.then(function(bank) {
			expect(bank).not.toBeNull();
			done();
		});
		$httpBackend.expect('GET', '/api/bank/engine/' + type)//
		.respond(200, {
			'type' : type,
			'title' : type,
			'description' : 'Mellat Payment Service',
			'symbol' : 'mellat'
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
