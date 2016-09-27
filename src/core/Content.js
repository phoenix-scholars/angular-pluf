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
 * @ngdoc factory
 * @name PContent
 * @description ساختار داده‌ای محتوی را ایجاد می‌کند. این ساختار داده‌ای شامل
 *              اطلاعات کلی از محتوی است که از این میان می‌توان به موارد زیر
 *              اشاره کرد:
 * 
 * @attr {integer} id
 * @attr {string} name
 * @attr {string} mimetype
 * @attr {integer} tenant
 */
.factory('PContent', function($http, $httpParamSerializerJQLike, $q, PObject) {

	function _initContent(scope) {
		scope.link = '/api/saascms/content/' + scope.id + '/download';
	}

	var pContent = function() {
		PObject.apply(this, arguments);
		_initContent(this);
	};
	pContent.prototype = new PObject();

	/**
	 * محتوی را به روز می‌کند
	 * 
	 * @memberof PContent
	 * @return {promise} محتوی جدید ایجاد شده
	 */
	pContent.prototype.update = function() {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/saascms/content/' + this.id,
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
			_initContent(scope);
			return scope;
		});
	};

	/**
	 * محتوی را حذف می‌کند
	 * 
	 * @memberof PContent
	 * @return {promise} محتوی حذف شده
	 */
	pContent.prototype.remove = function() {
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/saascms/content/' + this.id
		}).then(function() {
			delete scope.id;
			return scope;
		});
	};

	/**
	 * مقدار محتوی را تعیین می‌کند که معمولا برای گرفتن محتوی ساختار یافته و
	 * رشته‌ها مناسب است. در سایر موارد استفاده از پیوند محتوی بهتر است.
	 * 
	 * @memberof PContent
	 * @return {promise} مقدار محتوی
	 */
	pContent.prototype.value = function() {
		// TODO: maso, 1395: محتوی صفحه را می‌دهد
		// if(this._cvalue()){
		// var deferred = $q.defer();
		// deferred.resolve(this._cvalue());
		// return deferred.promise;
		// }
		return $http({
			method : 'GET',
			url : this.link
		}).then(function(res) {
			// scope._setCvalue(res.data);
			return res.data;
		});
	};

	/**
	 * مقدار جدیدی را برای این محتوی تعیین می‌کند.
	 * 
	 * @memberof PContent
	 * @param {object}
	 *            data مقدار جدید برای محتوی
	 * @return {promise} محتوی به روز شده
	 */
	pContent.prototype.setValue = function(newValue) {
		var scope = this;
		return $http({
			method : 'POST',
			url : this.link,
			data : newValue,
		}).then(function() {
			return scope;
		});
	};

	/**
	 * یک فایل را به عنوان مقدار بار می‌کند
	 * 
	 * ورودی باید فایل جاوسکریپت باشه.
	 * 
	 * @param file
	 * @returns
	 */
	pContent.prototype.upload = function(file) {
		var fd = new FormData();
		fd.append('file', file);
		return $http.post(this.link, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		});
	};

	return pContent;
});
