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

describe('Book module: $book', function() {
	var $book;
	var $rootScope;
	var $httpBackend;
	var $timeout;

	beforeEach(function() {
		module('pluf');
	});

	beforeEach(function() {
		inject(function(_$book_, _$rootScope_, _$httpBackend_, _$timeout_) {
			$book = _$book_;

			// Concurent test
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		});
	});

	it('should implements books API', function() {
		expect(angular.isFunction($book.books)).toBe(true);
	});
	it('should call /api/book/find to get books', function(done) {
		$book.books()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('GET', '/api/book/find')//
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

	it('should implements book API', function() {
		// gate api
		expect(angular.isFunction($book.book)).toBe(true);
	});
	it('should call /api/book/{id} to get book', function(done) {
		var id = 1;
		$book.book(id)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('GET', '/api/book/' + id)//
		.respond(200, {
			'id' : id
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should implements newbook API', function() {
		expect(angular.isFunction($book.newBook)).toBe(true);
	});
	it('should call /api/book/new to crate new', function(done) {
		var id = 1;
		var data = {
			id : id,
			title : 'title'
		};
		$book.newBook(data)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});
		$httpBackend//
		.expect('POST', '/api/book/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
