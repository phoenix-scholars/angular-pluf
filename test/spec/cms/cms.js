/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
// XXX: maso, 1395: پیاده سازی تست‌ها برای مدیریت محتوی
// TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('Core module test: $cms', function() {
	var originalTimeout;
	var $rootScope;
	var $cms;
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
		inject(function(_$cms_, _$rootScope_, _$httpBackend_, _$timeout_,
				_PaginatorParameter_) {
			$cms = _$cms_;
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
	it('should contains content function', function() {
		expect(angular.isFunction($cms.content)).toBe(true);
	});

	it('should contains contents function', function() {
		expect(angular.isFunction($cms.contents)).toBe(true);
	});

	it('should newContent function', function() {
		expect(angular.isFunction($cms.newContent)).toBe(true);
	});

	// Test functions
	// TODO: Hadi: این تست کامل نیست. باید ارسال فایل هم تست شود
	it('should call /api/cms/new to create new content', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		$cms.newContent(data)//
		.then(function(content) {
			expect(content.hasOwnProperty('id')).toBe(true);
			expect(content).not.toBeNull();
			expect(content.id).not.toBeUndefined();
			expect(content.id).toBe(id);
			expect(content.title).toBe('content title');
			expect(content.description).toBe('content description');
			done();
		});

		$httpBackend//
		.expect('POST', '/api/cms/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should call /api/cms/{id} to get a content', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		$cms.content(id)//
		.then(function(content) {
			expect('id' in content).toBe(true);
			expect(content).not.toBeNull();
			expect(content.id).not.toBeUndefined();
			expect(content.id).toBe(id);
			expect(content.title).toBe('content title');
			expect(content.description).toBe('content description');
			done();
		});
		$httpBackend//
		.expect('GET', '/api/cms/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should call /api/cms/find to get contents', function(done) {
		$cms.contents()//
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
				title : 'title1',
				description : 'description1'
			}, {
				id : 2,
				title : 'title2',
				description : 'description2'
			}, {
				id : 3,
				title : 'title3',
				description : 'description3'
			} ],
			counts : 3,
			current_page : 1,
			item_per_page : 10,
			page_number : 1
		};
		$httpBackend//
		.expect('GET', '/api/cms/find')//
		.respond(200, fakePaginatedResult);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
