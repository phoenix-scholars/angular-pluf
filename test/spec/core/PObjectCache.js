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

describe('Core module: PObjectCache', function() {
	var PObjectCache;
	var PObject;

	beforeEach(function() {
		module('pluf');
		inject(function(_PObjectCache_, _PObject_) {
			PObjectCache = _PObjectCache_;
			PObject = _PObject_;
		});
	});

	// check to see if it has the expected function
	it('should define restore', function() {
		var cache = new PObjectCache(function(data) {
			return new PObject(data);
		});
		expect(angular.isFunction(cache.restor)).toBe(true);
	});

	it('create new object', function(done) {
		var id = 12;
		var cache = new PObjectCache(function(data) {
			expect(data.id).toBe(id);
			done();
			return new PObject(data);
		});
		cache.restor(id, {
			id : id,
			title : 'example'
		});
	});
});
