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

describe('SasS module: PSpa', function() {
	var $rootScope;
	var $httpBackend;
	var PSpa;

	beforeEach(function() {
		module('pluf');
		inject(function(_PSpa_, _$rootScope_, _$httpBackend_) {
			PSpa = _PSpa_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		});
	});

	it('should contain update functions', function() {
		var spa = new PSpa({
			id : 1
		});
		expect(angular.isFunction(spa.update)).toBe(true);
	});

	it('should call /api/spa/{id} to update', function(done) {
		var spa = new PSpa({
			id : 1
		});
		spa.update()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('POST', '/api/spa/' + spa.id)//
		.respond(200, {
			id : 1
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contain remove functions', function() {
		var spa = new PSpa({
			id : 1
		});
		expect(angular.isFunction(spa.remove)).toBe(true);
	});

	it('should call /api/spa/{id} to remove', function(done) {
		var spa = new PSpa({
			id : 1
		});
		spa.remove()//
		.then(function(page) {
			expect(page).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/spa/' + spa.id)//
		.respond(200, {
			id : 1
		// TODO: maso, 1395: Paginated page param
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
