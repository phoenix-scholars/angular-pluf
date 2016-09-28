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

describe('Book module: PBook', function() {
	var PBook;
	var $rootScope;
	var $httpBackend;
	var $timeout;

	beforeEach(function() {
		module('pluf');
		inject(function(_PBook_, _$rootScope_, _$httpBackend_, _$timeout_) {
			PBook = _PBook_;

			// Concurent test
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		});
	});

	// check to see if it has the expected function
	it('should contains update function', function() {
		var book = new PBook();
		expect(angular.isFunction(book.update)).toBe(true);
	});
	it('should call /api/book/{id} to update', function(done) {
		var data = {
			id : 1
		};
		var book = new PBook(data);
		book.update()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('POST', '/api/book/1')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains remove function', function() {
		var book = new PBook();
		expect(angular.isFunction(book.remove)).toBe(true);
	});
	it('should call /api/book/{id} to delete', function(done) {
		var data = {
			id : 1
		};
		var book = new PBook(data);
		book.remove()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/book/1')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains pages function', function() {
		var book = new PBook();
		expect(angular.isFunction(book.pages)).toBe(true);
	});
	it('should call /api/book/{id}/page/find to list pages', function(done) {
		var data = {
			id : 1
		};
		var book = new PBook(data);
		book.pages()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('GET', '/api/book/1/page/find')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains page function', function() {
		var book = new PBook();
		expect(angular.isFunction(book.page)).toBe(true);
	});
	it('should call /api/book/{id}/page/{id} to get page', function(done) {
		var data = {
			id : 1
		};
		var book = new PBook(data);
		book.page(1)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('GET', '/api/book/1/page/1')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains newPage function', function() {
		var book = new PBook();
		expect(angular.isFunction(book.newPage)).toBe(true);
	});
	it('should call /api/book/{id}/page/new to create a page', function(done) {
		var data = {
			id : 1
		};
		var book = new PBook(data);
		book.newPage(data)//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('POST', '/api/book/1/page/new')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

});
