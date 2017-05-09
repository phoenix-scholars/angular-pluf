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

describe('Collection service', function() {
	var $collection;
	var $rootScope;
	var $httpBackend;
	var $timeout;
	var PaginatorParameter;

	beforeEach(function() {
		module('pluf');
	});

	beforeEach(function() {
		inject(function(_$collection_, _$rootScope_, _$httpBackend_, _$timeout_,
				_PaginatorParameter_) {
			$collection = _$collection_;

			// Concurent test
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
			PaginatorParameter = _PaginatorParameter_;
		});
	});

	/***************************************************************************
	 * collection
	 **************************************************************************/
	it('should implements collection API', function() {
		// collection api
		expect(angular.isFunction($collection.collections)).toBe(true);
		expect(angular.isFunction($collection.collection)).toBe(true);
		expect(angular.isFunction($collection.newCollection)).toBe(true);
	});
	
	it('find collection with params', function(done) {
		var pag = new PaginatorParameter();
		$collection.collections(pag)//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('GET', '/api/collection/find')//
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

	it('find bank without params', function(done) {
		$collection.collections()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('GET', '/api/collection/find')//
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

	it('get collection tests', function(done) {
		var type = 'xxxx';
		$collection.collection(type)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('GET', '/api/collection/' + type)//
		.respond(200, {
			'id' : type,
			'title' : type,
			'description' : 'test object'
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
