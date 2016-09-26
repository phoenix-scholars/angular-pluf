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

describe('Core module: PGroup', function() {
	var originalTimeout;
	var $rootScope;
	var $httpBackend;
	var PUser;
	var PGroup;
	var PRole;
	// excuted before each "it" is run.
	beforeEach(function() {
		// load the module.
		module('pluf');
		// inject your service for testing.
		// The _underscores_ are a convenience thing
		// so you can have your variable name be the
		// same as your injected service.
		inject(function(_PUser_, _PRole_, _PGroup_, _$rootScope_,
				_$httpBackend_) {
			PUser = _PUser_;
			PRole = _PRole_;
			PGroup = _PGroup_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		});
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it('should contain update functions', function() {
		var group = new PGroup();
		expect(angular.isFunction(group.update)).toBe(true);
	});

	it('should contain remove functions', function() {
		var group = new PGroup();
		expect(angular.isFunction(group.remove)).toBe(true);
	});

	/*
	 * User
	 */
	it('should contain user access', function() {
		var group = new PGroup();
		expect(angular.isFunction(group.users)).toBe(true);
		expect(angular.isFunction(group.removeUser)).toBe(true);
	});
	it('should call /api/role/{id}/group/find to users', function(done) {
		var group = new PGroup({
			id : 1
		});
		group.users()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/group/' + group.id + '/user/find')//
		.respond(200, {
			items : [],
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/group/{id}/user/{id} to remove user', function(done) {
		var group = new PGroup({
			id : 1,
		});
		var user = new PUser({
			id : 1
		});

		group.removeUser(user)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/group/' + group.id + '/user/' + user.id)//
		.respond(200, user);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	/*
	 * Role
	 */
	it('should contain role access', function() {
		var group = new PGroup();
		expect(angular.isFunction(group.roles)).toBe(true);
		expect(angular.isFunction(group.removeRole)).toBe(true);
	});
	it('should call /api/group/{id}/role/find to list roles', function(done) {
		var group = new PGroup({
			id : 1,
		});
		group.roles()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/group/' + group.id + '/role/find')//
		.respond(200, {
			items : [],
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/group/{id}/role/{id} to remove role', function(done) {
		var group = new PGroup({
			id : 1,
		});
		var role = new PRole({
			id : 1
		});

		group.removeRole(role)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/group/' + group.id + '/role/' + role.id)//
		.respond(200, role);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
