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

angular.module('pluf')

/**
 * @ngdoc factory
 * @name PGroup
 * @memberof pluf
 * 
 * @description
 * 
 */
.factory('PMonitor', function(PObject, $pluf, PObjectFactory) {
    /*
     * یک نمونه جدید از این موجودیت ایجاد می کند.
     */
    var pMonitor = function(data) {
	if (data) {
	    this.setData(data);
	}
    };

    pMonitor.prototype = new PObject();

//    pMonitor._cache = new PObjectFactory(function(data) {
//	pMonitor.setData(data);
//	return pMonitor;
//    });

    pMonitor.prototype.refresh = $pluf.createUpdate({
	method : 'GET',
	url : '/api/monitor/:bean/:property',
    });

    pMonitor.prototype.setBean = function(bean) {
	this.bean = bean;
	return this;
    }

    pMonitor.prototype.setProperty = function(property) {
	this.property = property;
	return this;
    }

    return pMonitor;
});
