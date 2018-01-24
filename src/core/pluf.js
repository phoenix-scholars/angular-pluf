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
 * 
 * 
 * 
 * Object describing the request to be made and how it should be processed. The
 * object has following properties:
 * 
 * method – {string} – HTTP method (e.g. 'GET', 'POST', etc)
 * 
 * url – {string|TrustedObject} – Absolute or relative URL of the resource that
 * is being requested; or an object created by a call to
 * $sce.trustAsResourceUrl(url).
 * 
 * params – {Object.<string|Object>} – Map of strings or objects which will be
 * serialized with the paramSerializer and appended as GET parameters.
 * 
 * data – {string|Object} – Data to be sent as the request message data.
 * 
 * headers – {Object} – Map of strings or functions which return strings
 * representing HTTP headers to send to the server. If the return value of a
 * function is null, the header will not be sent. Functions accept a config
 * object as an argument.
 * 
 * eventHandlers - {Object} - Event listeners to be bound to the XMLHttpRequest
 * object. To bind events to the XMLHttpRequest upload object, use
 * uploadEventHandlers. The handler will be called in the context of a $apply
 * block.
 * 
 * uploadEventHandlers - {Object} - Event listeners to be bound to the
 * XMLHttpRequest upload object. To bind events to the XMLHttpRequest object,
 * use eventHandlers. The handler will be called in the context of a $apply
 * block.
 * 
 * xsrfHeaderName – {string} – Name of HTTP header to populate with the XSRF
 * token.
 * 
 * xsrfCookieName – {string} – Name of cookie containing the XSRF token.
 * 
 * transformRequest – {function(data, headersGetter)|Array.<function(data,
 * headersGetter)>} – transform function or an array of such functions. The
 * transform function takes the http request body and headers and returns its
 * transformed (typically serialized) version. See Overriding the Default
 * Transformations
 * 
 * transformResponse – {function(data, headersGetter, status)|Array.<function(data,
 * headersGetter, status)>} – transform function or an array of such functions.
 * The transform function takes the http response body, headers and status and
 * returns its transformed (typically deserialized) version. See Overriding the
 * Default Transformations
 * 
 * paramSerializer - {string|function(Object<string,string>):string} - A
 * function used to prepare the string representation of request parameters
 * (specified as an object). If specified as string, it is interpreted as
 * function registered with the $injector, which means you can create your own
 * serializer by registering it as a service. The default serializer is the
 * $httpParamSerializer; alternatively, you can use the
 * $httpParamSerializerJQLike
 * 
 * cache – {boolean|Object} – A boolean value or object created with
 * $cacheFactory to enable or disable caching of the HTTP response. See $http
 * Caching for more information.
 * 
 * timeout – {number|Promise} – timeout in milliseconds, or promise that should
 * abort the request when resolved.
 * 
 * withCredentials - {boolean} - whether to set the withCredentials flag on the
 * XHR object. See requests with credentials for more information.
 * 
 * responseType - {string} - see XMLHttpRequest.responseType.
 * 
 */
.service('$pluf',
		function(PaginatorPage, $q, $http, $httpParamSerializerJQLike) {

	/**
	 * مسیر رو بر اساس مقادیر ورودی تعیین می‌کنه
	 * 
	 * زمانی که بخواهیم مسیر برای اجرای یک تابع بر اساس پارامترهای خود
	 * موجودیت ایجاد بشه، با استفاده از روش زیر، مسیر رو تعیین می‌کنیم:
	 * 
	 * <pre><code>
	 * var path = '/path/:property/of/object';
	 * </code></pre>
	 * 
	 * مقادیری که که با : تعیین شده باشن با استفاده از خصوصیت‌هایی که
	 * توی خود موجودیت باشه جایگزین می‌شه.
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
	
	// FIXME: 
	function createPathParam(path, object) {
		path = path.replace('{id}', object.id);
		return path;
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
		params.method = params.method || 'GET';
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
		params.method = params.method || 'GET';
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
		params.method = params.method || 'POST';
		params.headers = {
				'Content-Type' : 'application/x-www-form-urlencoded'
		};
		var urlTemplate = params.url;
		return function(objectData) {
			if (!objectData) {
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
		params.method = params.method || 'DELETE';
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
	 * Remove Association of a resource
	 * 
	 * @memberof $pluf
	 * @param {Object}
	 *                params
	 * @param {PObjectCache}
	 *                cache
	 * @return {function}
	 */
	this.createDeleteAss = function(params, _cache) {
		params.method = params.method || 'DELETE';
		var urlTemplate = params.url;
		return function(child) {
			var scope = this;
			params.url = createPath(urlTemplate, scope);
			if(child.id){
				params.url = params.url.replace('{id}', child.id);
			}
			return $http(params)//
			.then(function(res) {
				if (_cache) {
					return _cache.restor(res.data.id, res.data);
				}
				return res.data;
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
		params.method = params.method || 'POST';
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

	/**
	 * Create a get method
	 */
	this.get = function(params, _cache) {
		params.method = params.method || 'GET';
		if (params.url.indexOf(':') === 0) {
			// No need to create path dynamically
			return function(data) {
				if (!data) {
					data = {};
				}
				params.params = data;
				return $http(params)//
				.then(function(res) {
					if (_cache) {
						return _cache.restor(res.data.id, res.data);
					}
					return res.data;
				});
			};
		}
		var urlTemplate = params.url;
		return function(data) {
			if (!data) {
				data = {};
			}
			params.url = createPath(urlTemplate, this);
			params.params = data;
			return $http(params)//
			.then(function(res) {
				if (_cache) {
					return _cache.restor(res.data.id, res.data);
				}
				return res.data;
			});
		};
	};

	/**
	 * Post data
	 * 
	 * @memberof $pluf
	 * @param {Object}
	 *                params
	 * @param {PObjectCache}
	 *                _cache
	 * @return {function}
	 */
	this.post = function(params, _cache){
		params.method = params.method || 'POST';
		params.headers = {
				'Content-Type' : 'application/x-www-form-urlencoded'
		};
		var urlTemplate = params.url;
		return function(data) {
			if (!data) {
				data = this;
			}
			params.url = createPath(urlTemplate, this);
			params.data = $httpParamSerializerJQLike(data);
			return $http(params)//
			.then(function(res) {
				if (_cache) {
					return _cache.restor(res.data.id, res.data);
				}
				return res.data;
			});
		};
	};
	
	/**
	 * 
	 */
	this.put = function (params, _cache){
		params.method = params.method || 'PUT';
		var urlTemplate = params.url;
		return function(data, pathParam) {
			if (!data) {
				data = this;
			}
			params.url = createPath(urlTemplate, this);
			if(pathParam){
				params.url = createPathParam(params.url, pathParam);
			}
			params.data = data;
			return $http(params)//
			.then(function(res) {
				if (_cache) {
					return _cache.restor(res.data.id, res.data);
				}
				return res.data;
			});
		};
	};
	
});
