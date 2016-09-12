/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
