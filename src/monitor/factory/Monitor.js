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
.factory('PMonitor', function(PObject, $rootScope, $http,PaginatorPage, PMonitorProperty) {

    /*
     * یک نمونه جدید از این موجودیت ایجاد می کند.
     */
    var pMonitor = function() {
	PObject.apply(this, arguments);
    };
    pMonitor.prototype = new PObject();


    pMonitor.prototype.properties = function(paginatorParameter) {
	var params = {
		'method' : 'GET',
		'url': '/api/monitor/'+this.id+'/property/find'
	}
	if (paginatorParameter) {
	    params.params = paginatorParameter.getParameter();
	}
	var scope = this;
	return $http(params)//
	.then(function(res) {
	    var page = new PaginatorPage(res.data);
	    var items = [];
	    for (var i = 0; i < page.counts; i++) {
		var item = page.items[i];
		var p = new PMonitorProperty(item);
		p.monitor = scope.id;
		items.push(p);
	    }
	    page.items = items;
	    return page;
	});
    };

    return pMonitor;
});
