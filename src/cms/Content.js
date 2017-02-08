/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
		scope.link = '/api/cms/' + scope.id + '/download';
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
			url : '/api/cms/' + this.id,
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
			url : '/api/cms/' + this.id
		}).then(function() {
			delete scope.id;
			return scope;
		});
	};

	pContent.prototype.delete = pContent.prototype.remove;
	
	/**
	 * مقدار محتوی را تعیین می‌کند که معمولا برای گرفتن محتوی ساختار یافته و
	 * رشته‌ها مناسب است. در سایر موارد استفاده از پیوند محتوی بهتر است.
	 * 
	 * @memberof PContent
	 * @return {promise} مقدار محتوی
	 */
	pContent.prototype.value = function() {
		return $http({
			method : 'GET',
			url : this.link
		}).then(function(res) {
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
