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

describe('SaaS module: PInvoice', function() {
	var $rootScope;
	var $httpBackend;
	var PInvoice;

	beforeEach(function() {
		module('pluf');
		inject(function(_PInvoice_, _$rootScope_, _$httpBackend_) {
			PInvoice = _PInvoice_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
		});
	});

	it('should contain pay functions', function() {
		var invoice = new PInvoice({
			id : 1
		});
		expect(angular.isFunction(invoice.pay)).toBe(true);
	});

	it('should call /api/saas/invoice/{id}/pay to create receipt for invoices', function(done) {
		var invoice = new PInvoice({
			id : 1
		});
		invoice.pay()//
		.then(function(receipt) {
			expect(receipt).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});

		$httpBackend//
		.expect('POST', '/api/saas/invoice/' + invoice.id + '/pay')//
		.respond(200, {
			id : 1
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	
	it('should contain state functions', function() {
		var invoice = new PInvoice({
			id : 1
		});
		expect(angular.isFunction(invoice.state)).toBe(true);
	});
	
	it('should call /api/saas/invoice/{id}/state to remove', function(done) {
		var invoice = new PInvoice({
			id : 1
		});
		invoice.state()//
		.then(function(inv) {
			expect(inv).not.toBeNull();
			done();
		}, function() {
			expect(false).toBe(true);
			done();
		});
		
		$httpBackend//
		.expect('GET', '/api/saas/invoice/' + invoice.id + '/state')//
		.respond(200, {
			id : 1
		});
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
	
});
