/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
//XXX: maso, 1395: پیاده سازی تست‌ها برای تخفیف
//TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('Core module test: $discount', function() {
	var originalTimeout;
	var $rootScope;
	var $discount;
	var $timeout;
	var PaginatorParameter;
	var $httpBackend;
	// excuted before each "it" is run.
	beforeEach(function() {
		// load the module.
		module('pluf');
		// inject your service for testing.
		// The _underscores_ are a convenience thing
		// so you can have your variable name be the
		// same as your injected service.
		inject(function(_$discount_, _$rootScope_, _$httpBackend_, _$timeout_,
				_PaginatorParameter_) {
			$discount = _$discount_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
			PaginatorParameter = _PaginatorParameter_;
		});
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	// check to see if it has the expected function
	// Check functions for Content
	it('should contains discount function', function() {
		expect(angular.isFunction($discount.discount)).toBe(true);
	});

	it('should contains discounts function', function() {
		expect(angular.isFunction($discount.discounts)).toBe(true);
	});

	it('should newDiscount function', function() {
		expect(angular.isFunction($discount.newDiscount)).toBe(true);
	});

	// Test functions
	it('should call /api/discount/new to create new discount', function(done) {
		var id = 1;
		var data = {
				id : id,
				code : 'discount_code',
				type: 'publicpercent',
				off_value : 30,
				name : 'discount name',
				description : 'discount description'
		};
		$discount.newDiscount(data)//
		.then(function(discount) {
			expect(discount.hasOwnProperty('id')).toBe(true);
			expect(discount).not.toBeNull();
			expect(discount.id).not.toBeUndefined();
			expect(discount.id).toBe(id);
			expect(discount.code).toBe('discount_code');
			expect(discount.type).toBe('publicpercent');
			expect(discount.off_value).toBe(30);
			expect(discount.name).toBe('discount name');
			expect(discount.description).toBe('discount description');
			done();
		});

		$httpBackend//
		.expect('POST', '/api/discount/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should call /api/discount/{id} to get a discount', function(done) {
		var id = 1;
		var data = {
				id : id,
				code : 'discount_code',
				type: 'publicpercent',
				off_value : 30,
				name : 'discount name',
				description : 'discount description'
		};
		$discount.discount(id)//
		.then(function(discount) {
			expect('id' in discount).toBe(true);
			expect(discount).not.toBeNull();
			expect(discount.id).not.toBeUndefined();
			expect(discount.id).toBe(id);
			expect(discount.code).toBe('discount_code');
			expect(discount.type).toBe('publicpercent');
			expect(discount.off_value).toBe(30);
			expect(discount.name).toBe('discount name');
			expect(discount.description).toBe('discount description');
			done();
		});
		$httpBackend//
		.expect('GET', '/api/discount/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should call /api/discount/find to get discounts', function(done) {
		$discount.discounts()//
		.then(function(list) {
			expect(list).not.toBeNull();
			expect(list.items).not.toBeUndefined();
			expect(list.counts).not.toBeUndefined();
			expect(list.current_page).not.toBeUndefined();
			expect(list.item_per_page).not.toBeUndefined();
			expect(list.page_number).not.toBeUndefined();
			done();
		});

		var fakePaginatedResult = {
				items : [ {
					id : 1,
					code : 'discount_code1',
					type: 'publicpercent',
					off_value : 30,
					name : 'discount name1',
					description : 'discount description1'
				}, {
					id : 2,
					code : 'discount_code2',
					type: 'publicpercent',
					off_value : 30,
					name : 'discount name2',
					description : 'discount description2'
				}, {
					id : 3,
					code : 'discount_code3',
					type: 'publicpercent',
					off_value : 30,
					name : 'discount name3',
					description : 'discount description3'
				} ],
				counts : 3,
				current_page : 1,
				item_per_page : 10,
				page_number : 1
		};
		$httpBackend//
		.expect('GET', '/api/discount/find')//
		.respond(200, fakePaginatedResult);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
