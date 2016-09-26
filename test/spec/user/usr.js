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
describe('User service: $usr', function() {
	var originalTimeout;
	var $rootScope;
	var $usr;
	var $httpBackend;
	// excuted before each "it" is run.
	beforeEach(function() {
		// load the module.
		module('pluf');
		// inject your service for testing.
		// The _underscores_ are a convenience thing
		// so you can have your variable name be the
		// same as your injected service.
		inject(function(_$usr_, _$rootScope_, _$httpBackend_) {
			$usr = _$usr_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		});
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	// check to see if it has the expected function
	it('should contain login function', function() {
		expect(angular.isFunction($usr.login)).toBe(true);
	});
	it('should contain logout function', function() {
		expect(angular.isFunction($usr.logout)).toBe(true);
	});

	it('should contain session function', function() {
		expect(angular.isFunction($usr.session)).toBe(true);
	});

	it('Logout with', function(done) {
		$usr.logout().then(function(user) {
			expect(user).not.toBeNull();
			expect(user.login).toBeUndefined();
			expect(user.id).toBeUndefined();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});
		$rootScope.$apply();
	});

	it('Login with admin,admin', function(done) {
		$usr.login({
			login : 'amdin',
			password : 'admin'
		}).then(function(user) {
			expect(user).not.toBeNull();
			expect(user.login).toBe('admin');
			expect(user.id).not.toBeUndefined();
			done();
		});
		$httpBackend.expect('POST', '/api/user/login').respond(200, {
			id : '1',
			login : 'admin',
			administrator : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('Login & logout with admin,admin', function(done) {
		$usr.login({
			login : 'amdin',
			password : 'admin'
		}).then(function(user) {
			expect(user).not.toBeNull();
			expect(user.login).toBe('admin');
			expect(user.id).not.toBeUndefined();
			done();
		});
		$httpBackend.expect('POST', '/api/user/login').respond(200, {
			id : '1',
			login : 'admin',
			administrator : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should call /api/user to get current user.', function(done) {
		$usr.session().then(function(user) {
			expect(user).not.toBeNull();
			expect(user.login).not.toBeNull();
			expect(user.id).not.toBeNull();
			expect($usr.isAnonymous()).toBe(false);
			expect(user.isAnonymous()).toBe(false);
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.expect('GET', '/api/user').respond(200, {
			id : '1',
			login : 'admin',
			administrator : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain role', function() {
		expect(angular.isFunction($usr.roles)).toBe(true);
		expect(angular.isFunction($usr.role)).toBe(true);
		expect(angular.isFunction($usr.newRole)).toBe(true);
	});
	it('should call /api/role/find to list all role', function(done) {
		$usr.roles()//
		.then(function(rolesPage) {
			expect(rolesPage).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.//
		expect('GET', '/api/role/find')//
		.respond(200, {
			itmes : [],
			item_per_page : 20,
			current_page : 1
		// TODO: maso, 1395: add paginated page params
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/role/{id} to get a role', function(done) {
		var id = 1;
		$usr.role(id)//
		.then(function(role) {
			expect(role).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.//
		expect('GET', '/api/role/' + id)//
		.respond(200, {
			id : id,
			title : 'role title'
		// TODO: maso, 1395: add role params
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/role/new to create a  role', function(done) {
		var data = {
			title : 'title',
			id : 1,
			description : 'description'
		// TODO: maso, 1395: add role params
		};
		$usr.newRole()//
		.then(function(role) {
			expect(role).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.//
		expect('POST', '/api/role/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
