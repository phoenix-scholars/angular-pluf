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

describe('Core module: PUser', function() {
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

	it('should contain profile functions', function() {
		var user = new PUser();
		expect(angular.isFunction(user.profile)).toBe(true);
	});

	it('should call /api/user/{id}/profile to get profile', function(done) {
		var user = new PUser();
		user.id = 1;
		user.profile().then(function(profile) {
			expect(profile).not.toBeNull();
			expect(profile.id).not.toBeNull();
			expect(profile.user).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.expect('GET', '/api/user/1/profile').respond(200, {
			id : '1',
			name : 'admin',
			administrator : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain update functions', function() {
		var user = new PUser();
		expect(angular.isFunction(user.update)).toBe(true);
	});
	it('should call /api/user/{id} to update', function(done) {
		var user = new PUser();
		user.id = 1;
		user.first_name = 'xxx';
		user.update().then(function(user) {
			expect(user).not.toBeNull();
			expect(user.id).toBe(1);
			expect(user.temp).not.toBeNull();
			expect(user.first_name).toBe('yyy');
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend.expect('POST', '/api/user/1').respond(200, {
			id : 1,
			first_name : 'yyy',
			temp : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	/*
	 * Groups
	 */
	it('should contain group access', function() {
		var user = new PUser();
		expect(angular.isFunction(user.groups)).toBe(true);
		expect(angular.isFunction(user.removeGroup)).toBe(true);
	});
	it('should call /api/user/{id}/group/find to list groups', function(done) {
		var user = new PUser();
		user.id = 1;
		user.first_name = 'xxx';
		user.groups()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/user/' + user.id + '/group/find')//
		.respond(200, {
			items : [],
			// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/user/{id}/group/{id} to remove group', function(done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});
		var group = new PGroup({
			id : 1
		});

		user.removeGroup(group)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/user/' + user.id + '/group/' + group.id)//
		.respond(200, group);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/user/{id}/group/new to add group to user', function(done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});
		var group = new PGroup({
			id : 1,
			group_id : 1
		});
		
		user.newGroup(group)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});
		
		$httpBackend//
		.expect('POST', '/api/user/' + user.id + '/group/new')//
		.respond(200, group);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	/*
	 * Rolse
	 */
	it('should contain role access', function() {
		var user = new PUser();
		expect(angular.isFunction(user.roles)).toBe(true);
		expect(angular.isFunction(user.removeRole)).toBe(true);
	});
	it('should call /api/user/{id}/role/find to list roles', function(done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});
		user.roles()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/user/' + user.id + '/role/find')//
		.respond(200, {
			items : [],
			// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/user/{id}/role/{id} to remove role', function(done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});
		var role = new PRole({
			id : 1
		});

		user.removeRole(role)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/user/' + user.id + '/role/' + role.id)//
		.respond(200, role);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	it('should call /api/user/{id}/role/new to add role to user', function(done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});
		var role = new PRole({
			id : 1,
			role : 1,
		});
		
		user.newRole(role)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});
		
		$httpBackend//
		.expect('POST', '/api/user/' + user.id + '/role/new')//
		.respond(200, role);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	/*
	 * Avatar
	 */
	it('should contain avatar', function() {
		var user = new PUser({
			id : 1
		});
		expect(user.avatar).toBe('/api/user/1/avatar');
	});

	/*
	 * Message
	 */

	it('should call /api/user/{id}/message/find to search message', function(
			done) {
		var user = new PUser({
			id : 1,
			first_name : 'first name',
			last_name : 'last'
		});

		user.messages()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('GET', '/api/user/' + user.id + '/message/find')//
		.respond(200, {
			items : [],
			// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
