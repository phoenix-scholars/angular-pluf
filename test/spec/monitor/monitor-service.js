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

describe('$monitor service', function() {
    var originalTimeout;
    var $rootScope;
    var $monitor;
    var $httpBackend;
    var $timeout;

    // excuted before each "it" is run.
    beforeEach(function() {
	// load the module.
	module('pluf');
	// inject your service for testing.
	// The _underscores_ are a convenience thing
	// so you can have your variable name be the
	// same as your injected service.
	inject(function(_$monitor_, _$rootScope_, _$httpBackend_, _$timeout_) {
	    $monitor = _$monitor_;
	    $rootScope = _$rootScope_;
	    $httpBackend = _$httpBackend_;
	    $timeout = _$timeout_;
	});
	originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    // check to see if it has the expected function
    it('should contain monitor function', function() {
	expect(angular.isFunction($monitor.monitor)).toBe(true);
    });
    it('should contain monitors function', function() {
	expect(angular.isFunction($monitor.monitors)).toBe(true);
    });

    it('should contain distroy function', function() {
	expect(angular.isFunction($monitor.distroy)).toBe(true);
    });

    it('should call /api/monitor/find to list all monitor', function(done) {
	$monitor.monitors()//
	.then(function(page) {
	    expect(page).not.toBeNull();
	    done();
	}, function() {
	    expect(false).toBe(true);
	    done();
	});

	$httpBackend.//
	expect('GET', '/api/monitor/find')//
	.respond(200, {
	    itmes : [],
	    item_per_page : 20,
	    current_page : 1
	// TODO: maso, 1395: add paginated page params
	});
	expect($httpBackend.flush).not.toThrow();
	$rootScope.$apply();
    });
    it('should get a monitor', function(done) {
	$monitor.monitor('bean', 'property')//
	.then(function(object) {
	    expect(object).not.toBeNull();
	    done();
	}, function() {
	    expect(false).toBe(true);
	    done();
	});
	$rootScope.$apply();
	$timeout.flush();
    });
});
