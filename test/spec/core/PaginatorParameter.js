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

describe('Core object: PaginatorParameter', function() {
//	var PObjectCache;
	var PaginatorParameter;

	beforeEach(function() {
		module('pluf');
		inject(function(_PaginatorParameter_) {
			PaginatorParameter = _PaginatorParameter_;
		});
	});

	it('check functions', function() {
		var pag = new PaginatorParameter();
		expect(angular.isFunction(pag.addFilter)).toBe(true);
		expect(angular.isFunction(pag.removeFilter)).toBe(true);
	});
	
	it('check sort params', function() {
		var pag = new PaginatorParameter();
		pag.addSorter('s1', 'v1');
		pag.addSorter('s2', 'v2');
		var skArr = pag.getParameter()._px_sk;
		var soArr = pag.getParameter()._px_so;
		expect(skArr.length).toEqual(2);
		expect(soArr.length).toEqual(2);
		expect(skArr.indexOf('s1')).not.toBeLessThan(0);
		expect(soArr.indexOf('v1')).not.toBeLessThan(0);
	});
	
	it('check filter params', function() {
		var pag = new PaginatorParameter();
		pag.addFilter('f1', 'v1');
		pag.addFilter('f2', 'v2');
		var fkArr = pag.getParameter()._px_fk;
		var fvArr = pag.getParameter()._px_fv;
		expect(fkArr.length).toEqual(2);
		expect(fvArr.length).toEqual(2);
		expect(fkArr.indexOf('f1')).not.toBeLessThan(0);
		expect(fvArr.indexOf('v1')).not.toBeLessThan(0);
	});

});
