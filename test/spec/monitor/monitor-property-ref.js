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
    var PMonitorProperty;

    // excuted before each "it" is run.
    beforeEach(function() {
	// load the module.
	module('pluf');
	// inject your service for testing.
	// The _underscores_ are a convenience thing
	// so you can have your variable name be the
	// same as your injected service.
	inject(function(_$monitor_, _$rootScope_, _$httpBackend_, _$timeout_, _PMonitorProperty_) {
	    $monitor = _$monitor_;
	    $rootScope = _$rootScope_;
	    $httpBackend = _$httpBackend_;
	    $timeout = _$timeout_;
	    PMonitorProperty = _PMonitorProperty_;
	});
	originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
	jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should get info', function(done) {
	var monitor = new PMonitorProperty({
	    monitor: 'bean',
	    id: 'property'
	});
	monitor.refresh()//
	.then(function(object) {
	    expect(object).not.toBeNull();
	    done();
	}, function() {
	    expect(false).toBe(true);
	    done();
	});

	$httpBackend//
	.expect('GET', '/api/monitor/bean/property/property')//
	.respond(200, {
	    'value' : 12.0,
	    'min' : 0.0,
	});
	expect($httpBackend.flush).not.toThrow();
	$rootScope.$apply();
    });
});
