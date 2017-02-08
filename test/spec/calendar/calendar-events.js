/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

describe('$calendar', function() {
    var $calendar;
    var PEvent;
    var PCalendar;
    var $rootScope;
    var $httpBackend;
    var $timeout;

    beforeEach(function() {
	module('pluf');
    });

    beforeEach(function() {
	inject(function(_$calendar_, _$rootScope_, _$httpBackend_, _$timeout_,
		_PEvent_, _PCalendar_) {
	    $calendar = _$calendar_;

	    // Concurent test
	    $rootScope = _$rootScope_;
	    $httpBackend = _$httpBackend_;
	    $timeout = _$timeout_;
	    PEvent = _PEvent_;
	    PCalendar = _PCalendar_;
	});
    });

    it('should implements calendars API', function() {
	expect(angular.isFunction($calendar.events)).toBe(true);
	expect(angular.isFunction($calendar.event)).toBe(true);
	expect(angular.isFunction($calendar.newEvent)).toBe(true);
    });

    it('find evetns', function(done) {
	$calendar.events()//
	.then(function(page) {
	    expect(page).not.toBeNull();
	    done();
	});

	$httpBackend//
	.expect('GET', '/api/calendar/events/find')//
	.respond(200, {
	    'items' : [],
	    'counts' : 0,
	    'current_page' : 0,
	    'items_per_page' : 2,
	    'page_number' : 1
	});
	expect($httpBackend.flush).not.toThrow();
	$rootScope.$apply();
    });

    it('get event', function(done) {
	var object = {
		'id' : 1,
		'title' : 'title',
		'description' : 'description'
	};
	$calendar.event(object.id)//
	.then(function(value) {
	    expect(value).not.toBeNull();
	    done();
	});

	$httpBackend//
	.expect('GET', '/api/calendar/events/' + object.id)//
	.respond(200, object);
	expect($httpBackend.flush).not.toThrow();
	$rootScope.$apply();
    });
});
