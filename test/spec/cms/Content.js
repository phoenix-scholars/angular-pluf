/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
// XXX: maso, 1395: پیاده سازی تست‌ها برای مدیریت محتوی
// TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('CMS module: Content', function() {
	var $rootScope;
	var PContent;
	var $timeout;
	var $httpBackend;
	// excuted before each "it" is run.
	beforeEach(function() {
		module('pluf');
		inject(function(_PContent_, _$rootScope_, _$httpBackend_, _$timeout_) {
			PContent = _PContent_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		});
	});

	// check to see if it has the expected function
	// Check functions for Content
	it('should contains update function', function() {
		var content = new PContent();
		expect(angular.isFunction(content.update)).toBe(true);
	});
	it('should call /api/cms/{id} to update the content', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		var content = new PContent(data);
		content.update()//
		.then(function(content) {
			expect(content).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('POST', '/api/cms/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains remove function', function() {
		var content = new PContent();
		expect(angular.isFunction(content.remove)).toBe(true);
	});
	it('should call /api/cms/{id} to remove the content', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		var content = new PContent(data);
		content.remove()//
		.then(function(content) {
			expect(content).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('DELETE', '/api/cms/' + id)//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains value function', function() {
		var content = new PContent();
		expect(angular.isFunction(content.value)).toBe(true);
	});
	it('should call /api/cms/{id}/download to get the value', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		var content = new PContent(data);
		content.value()//
		.then(function(content) {
			expect(content).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('GET', '/api/cms/' + id + '/download')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains setValue function', function() {
		var content = new PContent();
		expect(angular.isFunction(content.setValue)).toBe(true);
	});
	it('should call /api/cms/{id}/download to set the value', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		var content = new PContent(data);
		content.setValue('Hi')//
		.then(function(content) {
			expect(content).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('POST', '/api/cms/' + id + '/download')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains upload function', function() {
		var content = new PContent();
		expect(angular.isFunction(content.upload)).toBe(true);
	});
	it('should call /api/cms/{id}/download to push a file', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'content title',
			description : 'content description'
		};
		var content = new PContent(data);
		content.upload('path/to/file')//
		.then(function(content) {
			expect(content).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('POST', '/api/cms/' + id + '/download')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
