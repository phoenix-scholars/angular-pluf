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
 * @memberof pluf
 * @ngdoc service
 * @name $pluf
 * @description ابزارهای پایه‌ای
 */
.service('$pluf',
	function(PaginatorPage, $q, $http, $httpParamSerializerJQLike) {

    /**
     * مسیر رو بر اساس مقادیر ورودی تعیین می‌کنه
     * 
     * زمانی که بخواهیم مسیر برای اجرای یک تابع بر اساس پارامترهای خود موجودیت
     * ایجاد بشه، با استفاده از روش زیر، مسیر رو تعیین می‌کنیم:
     * 
     * <pre><code>
     * 	var path = '/path/:property/of/object';
     * </code></pre>
     * 
     * مقادیری که که با : تعیین شده باشن با استفاده از خصوصیت‌هایی که توی خود 
     * موجودیت باشه جایگزین می‌شه.
     * 
     * @param path
     * @param object
     * @returns
     */
    function createPath(path, object) {
	if (path.indexOf(':') === 0) {
	    return path;
	}
	var list = path.split('/');
	var temp = path;
	for (var i = 0; i < list.length; i++) {
	    var id = list[i];
	    if (id.indexOf(':') === 0) {
		var key = id.substring(1, id.length);
		temp = temp.replace(id, object[key]);
	    }
	}
	return temp;
    }

    /**
     * 
     * @memberof $pluf
     * @param {Object}
     *                params
     * @param {PObjectCache}
     *                cache
     * @return {function}
     */
    this.createFind = function(params, _cache) {
	var urlTemplate = params.url;
	return function(paginatorParameter) {
	    if (paginatorParameter) {
		params.params = paginatorParameter.getParameter();
	    }
	    params.url = createPath(urlTemplate, this);
	    return $http(params)//
	    .then(function(res) {
		var page = new PaginatorPage(res.data);
		var items = [];
		for (var i = 0; i < page.counts; i++) {
		    var item = page.items[i];
		    items.push(_cache.restor(item.id, item));
		}
		page.items = items;
		return page;
	    });
	};
    };

    /**
     * 
     * @memberof $pluf
     * @param {Object}
     *                params
     * @param {PObjectCache}
     *                cache
     * @return {function}
     */
    this.createGet = function(params, _cache) {
	var urlTemplate = params.url;
	return function(id) {
	    if (_cache.contains(id)) {
		var deferred = $q.defer();
		deferred.resolve(_cache.get(id));
		return deferred.promise;
	    }
	    var temp = createPath(urlTemplate, this);
	    params.url = temp.replace('{id}', id);
	    return $http(params)//
	    .then(function(res) {
		return _cache.restor(res.data.id, res.data);
	    });
	};
    };

    /**
     * 
     */
    this.createUpdate = function(params) {
	params.headers = {
		'Content-Type' : 'application/x-www-form-urlencoded'
	};
	var urlTemplate = params.url;
	return function(objectData) {
	    if(!objectData){
		objectData = this;
	    }
	    var scope = this;
	    params.url = createPath(urlTemplate, scope);
	    params.data = $httpParamSerializerJQLike(objectData);
	    return $http(params)//
	    .then(function(res) {
		scope.setData(res.data);
		return scope;
	    });
	};
    };

    /**
     * 
     */
    this.createDelete = function(params) {
	var urlTemplate = params.url;
	return function() {
	    var scope = this;
	    params.url = createPath(urlTemplate, scope);
	    return $http(params)//
	    .then(function(res) {
		scope.setData(res.data);
		return scope;
	    });
	};
    };

    /**
     * 
     * @memberof $pluf
     * @param {Object}
     *                params
     * @param {PObjectCache}
     *                cache
     * @return {function}
     */
    this.createNew = function(params, _cache) {
	params.headers = {
		'Content-Type' : 'application/x-www-form-urlencoded'
	};
	var urlTemplate = params.url;
	return function(objectData) {
	    params.url = createPath(urlTemplate, this);
	    params.data = $httpParamSerializerJQLike(objectData);
	    return $http(params)//
	    .then(function(res) {
		return _cache.restor(res.data.id, res.data);
	    });
	};
    };

    // this.inherit = function(object) {
    // function F() {
    // // Empty object
    // }
    // F.prototype = object.prototype;
    // return new F;
    // };

});