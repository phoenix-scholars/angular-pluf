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
describe('User service: $saas', function() {

	var $saas;
	var $rootScope;
	var $httpBackend;

	// excuted before each "it" is run.
	beforeEach(function() {
		module('pluf');
		inject(function(_$saas_, _$rootScope_, _$httpBackend_) {
			$saas = _$saas_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		});
	});

	// check to see if it has the expected function
	it('should contain session function', function() {
		expect(angular.isFunction($saas.session)).toBe(true);
	});
	it('should call /api/tenant to get session tenant', function(done) {
		$saas.session()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/tenant')//
		.respond(200, {
			id : 1
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain tenants function', function() {
		expect(angular.isFunction($saas.tenants)).toBe(true);
	});
	it('should call /api/tenant/find to get list tenants', function(done) {
		$saas.tenants()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/tenant/find')//
		.respond(200, {
			items : []
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain tenant function', function() {
		expect(angular.isFunction($saas.tenant)).toBe(true);
	});
	it('should call /api/tenant/{id} to get tenants', function(done) {
		var id = 1;
		$saas.tenant(id)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/tenant/' + id)//
		.respond(200, {
			id : id
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain newTenant function', function() {
		expect(angular.isFunction($saas.newTenant)).toBe(true);
	});
	it('should call /api/tenant/new to create tenant', function(done) {
		var data = {
			id : 1,
			title : 'title'
		};
		$saas.newTenant(data)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('POST', '/api/tenant/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain spas function', function() {
		expect(angular.isFunction($saas.spas)).toBe(true);
	});
	it('should call /api/spa/find to get list SPA', function(done) {
		$saas.spas()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/spa/find')//
		.respond(200, {
			items : []
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain spa function', function() {
		expect(angular.isFunction($saas.spa)).toBe(true);
	});
	it('should call /api/spa/{id} to get SPA', function(done) {
		var id = 1;
		$saas.spa(id)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/spa/' + id)//
		.respond(200, {
			id : id
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain newSpa function', function() {
		expect(angular.isFunction($saas.newSpa)).toBe(true);
	});
	it('should call /api/spa/new to create spa', function(done) {
		var data = {
			id : 1,
			title : 'title'
		};
		$saas.newSpa(data)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('POST', '/api/spa/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
