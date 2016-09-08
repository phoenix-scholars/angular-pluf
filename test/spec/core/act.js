/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
describe('Core module test: $act', function() {
	var originalTimeout;
	var $rootScope;
	var $act;
	var $timeout;

	beforeEach(function() {
		module('pluf');
	});
	beforeEach(function() {
		inject(function(_$act_, _$rootScope_, _$timeout_) {
			$act = _$act_;
			$rootScope = _$rootScope_;
			$timeout = _$timeout_;
		});
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	it('Check command function', function() {
		expect(angular.isFunction($act.command)).toBe(true);
	});
	it('Check getCommand function', function() {
		expect(angular.isFunction($act.getCommand)).toBe(true);
	});
	it('add new command', function(done) {
		$act.command({
			id : 'user.login',
			label : 'label',
			icon : 'icon',
			tags : [ 'x', 'y' ]
		}).getCommand('user.login').then(function(command) {
			expect(command).not.toBeNull();
			expect(command.id).toBe('user.login');
			expect(command.tags).toEqual([ 'x', 'y' ]);
			expect(command.label).toBe('label');
			expect(command.icon).toBe('icon');
			done();
		});
		$timeout.flush();
		$rootScope.$apply();
	});

	it('Check handler function', function() {
		expect(angular.isFunction($act.handler)).toBe(true);
	});
	it('add new command and handler', function(done) {
		$act.command({
			id : 'command2'
		}).handler({
			command : 'command2',
			handle : function() {
			}
		}).getCommand('command2').then(function(command) {
			expect(command).not.toBeNull();
			expect(command.id).toBe('command2');
			expect(command.handler.length).toBe(1);
			done();
		});
		$timeout.flush();
		$rootScope.$apply();
	});
	it('add new handler to unknown command', function(done) {
		$act.handler({
			command : 'unknown',
			handle : function() {
			}
		}).getCommand('unknown').then(function(command) {
			expect(command).not.toBeNull();
			expect(command.handler.length).toBe(1);
			done();
		});
		$timeout.flush();
		$rootScope.$apply();
	});

	it('Check execute function', function() {
		expect(angular.isFunction($act.execute)).toBe(true);
	});
	it('execute a command', function(done) {
		$act.handler({
			command : 'command3',
			handle : function() {
				expect(true).toBe(true);
				done();
			}
		});
		$act.execute('command3');
		$timeout.flush();
		$rootScope.$apply();
	});
	it('execute a command with param', function(done) {
		$act.handler({
			command : 'command4',
			handle : function(param) {
				expect(param).toBe('example');
				done();
			}
		});
		$act.execute('command4', 'example');
		$timeout.flush();
		$rootScope.$apply();
	});
	it('execute a command with multi handler', function(done) {
		var count = 0;
		$act.handler({
			command : 'command5',
			handle : function(param) {
				expect(param).toBe('example');
				count++;
			}
		}).handler({
			command : 'command5',
			handle : function(param) {
				expect(param).toBe('example');
				count++;
			}
		});
		$act.execute('command5', 'example').then(function() {
			expect(count).toBe(2);
			done();
		});
		$timeout.flush();
		$rootScope.$apply();
	});

});
