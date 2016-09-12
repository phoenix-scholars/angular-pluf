/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Core module test: user authentication', function() {
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
	it('Check login function', function() {
		expect(angular.isFunction($usr.login)).toBe(true);
	});
	it('Check logout function', function() {
		expect(angular.isFunction($usr.logout)).toBe(true);
	});
	it('Check session function', function() {
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

	it('Check session (use was logedin before).', function(done) {
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

		$httpBackend.expect('GET', '/api/user/account').respond(200, {
			id : '1',
			login : 'admin',
			administrator : true
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
