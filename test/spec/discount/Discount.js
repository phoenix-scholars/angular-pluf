/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
//XXX: maso, 1395: پیاده سازی تست‌ها برای مدیریت محتوی
//TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('Discount module: Discount', function() {
	var $rootScope;
	var PDiscount;
	var $timeout;
	var $httpBackend;
	// excuted before each "it" is run.
	beforeEach(function() {
		module('pluf');
		inject(function(_PDiscount_, _$rootScope_, _$httpBackend_, _$timeout_) {
			PDiscount = _PDiscount_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		});
	});

	// check to see if it has the expected function
	// Check functions for Content
	it('should contains update function', function() {
		var discount = new PDiscount();
		expect(angular.isFunction(discount.update)).toBe(true);
	});
	it('should call /api/discount/{id} to update the discount', function(done) {
		var id = 1;
		var data = {
				id : id,
				code : 'discount_code',
				type: 'publicpercent',
				off_value : 30,
				name : 'discount name',
				description : 'discount description'
		};
		var discount = new PDiscount(data);
		discount.update()//
		.then(function(discount) {
			expect(discount).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('POST', '/api/discount/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains delete function', function() {
		var discount = new PDiscount();
		expect(angular.isFunction(discount.delete)).toBe(true);
	});
	it('should call /api/discount/{id} to delete the discount', function(done) {
		var id = 1;
		var data = {
				id : id,
				code : 'discount_code',
				type: 'publicpercent',
				off_value : 30,
				name : 'discount name',
				description : 'discount description'
		};
		var discount = new PDiscount(data);
		discount.delete()//
		.then(function(discount) {
			expect(discount).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('DELETE', '/api/discount/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
