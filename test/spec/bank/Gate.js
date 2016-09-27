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

describe('Bank module: PGate', function() {
	var PGate;
	var $rootScope;
	var $httpBackend;
	var $timeout;

	beforeEach(function() {
		module('pluf');
		inject(function(_PGate_, _$rootScope_, _$httpBackend_, _$timeout_) {
			PGate = _PGate_;

			// Concurent test
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_;
			$timeout = _$timeout_;
		});
	});

	// check to see if it has the expected function
	it('should contains update function', function() {
		var gate = new PGate();
		expect(angular.isFunction(gate.update)).toBe(true);
	});
	it('should call /api/bank/backend/{id} to update', function(done) {
		var data = {
			id : 1
		};
		var gate = new PGate(data);
		gate.update()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('POST', '/api/bank/backend/1')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});

	it('should contains remove function', function() {
		var gate = new PGate();
		expect(angular.isFunction(gate.remove)).toBe(true);
	});

	it('should call /api/bank/backend/{id} to delete', function(done) {
		var data = {
			id : 1
		};
		var gate = new PGate(data);
		gate.remove()//
		.then(function(object) {
			expect(object).not.toBeNull();
			done();
		});

		$httpBackend//
		.expect('DELETE', '/api/bank/backend/1')//
		.respond(200, data);
		expect($httpBackend.flush).not.toThrow();
		$rootScope.$apply();
	});
});
