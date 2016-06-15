/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PContent
 * @description
 * ساختار داده‌ای محتوی را ایجاد می‌کند. این ساختار داده‌ای شامل اطلاعات کلی از محتوی است که
 * از این میان می‌توان به موارد زیر اشاره کرد:
 *
 * @attr {integer} id
 * @attr {string} name
 * @attr {string} mimetype
 * @attr {integer} tenant
 */
.factory('PContent', function($http, $httpParamSerializerJQLike, $q, PObject) {
	var pContent = function() {
		PObject.apply(this, arguments);
	};
 	pContent.prototype = new PObject();
	/**
	 * محتوی را به روز می‌کند
	 *
	 * @memberof PContent
	 * @return {promise} محتوی جدید ایجاد شده
	 */
	pContent.prototype.update = function(){
		// TODO:maso, 1395: به روز کردن محتوی
	};

	/**
	 * محتوی را حذف می‌کند
	 * @memberof PContent
	 * @return {promise} محتوی حذف شده
	 */
	pContent.prototype.remove = function(){
		// TODO:maso, 1395: حذف محتوی
	};

	/**
	 * مقدار محتوی را تعیین می‌کند که معمولا برای گرفتن محتوی ساختار یافته و رشته‌ها مناسب
	 * است. در سایر موارد استفاده از پیوند محتوی بهتر است.
	 * @memberof PContent
	 * @return {promise} مقدار محتوی
	 */
	pContent.prototype.value = function(){
		// TODO: maso, 1395: محتوی صفحه را می‌دهد
		// if(this._cvalue()){
		// 	var deferred = $q.defer();
		// 	deferred.resolve(this._cvalue());
		// 	return deferred.promise;
		// }
		return $http({
			method: 'GET',
			url: '/api/saascms/content/'+this.id+'/download'
		}).then(function(res){
			// scope._setCvalue(res.data);
			return res.data;
		});
	};
	/**
	 * مقدار جدیدی را برای این محتوی تعیین می‌کند.
	 * @memberof PContent
	 * @param  {object} d مقدار جدید برای محتوی
	 * @return {promise}   محتوی به روز شده
	 */
	pContent.prototype.setValue = function(d){
		var scope = this;
		return $http({
			method:'POST',
			url: '/api/saascms/content/'+this.id+'/download',
			data: d,
		}).then(function(){
			return scope;
		});
	};
 	return pContent;
 });
