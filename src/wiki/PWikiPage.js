/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')

/**
 * @ngdoc factory
 * @name PWikiPage
 * @memberof pluf.wiki
 *
 * @description
 * ساختار داده‌ای یک صفحه به همراه اطلاعات کامل صفحه.
 *
 * @attr {Integer} id شناسه صفحه
 *
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 *
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 * @attr {Integer} book شناسه کتابی که این صفحه متعلق به آن است
 * @attr {String} language زبان مورد استفاده در متن صفحه
 * @attr {String} summary خلاصه‌ای از متن صفحه
 * @attr {Blob} content محتوای صفحه
 *
 * @attr {String} content_type
 * نوع متن صفحه. مثلا: text/html, text/plain, text/markdown , ...
 *
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد page
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */

.factory('PWikiPage', function($http, $httpParamSerializerJQLike, PException, PObject) {

	var wikiPage = function(d) {
		if (d) {
			this.setData(d);
		}
	};

	wikiPage.prototype = new PObject();

	/**
	 * اطلاعات یک صفحه را به‌روزرسانی می‌کند.
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {promise(PWikiPage)} صفحه به‌روزرسانی شده
	 */
	wikiPage.prototype.update = function() {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/page/' + this.id,
			data: $httpParamSerializerJQLike(scope),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * صفحه را حذف می‌کند
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {promise(PWikiPage)} صفحه حذف شده برگردانده می شود
	 */
	wikiPage.prototype.remove = function() {
		var scope = this;
		return $http({
			method: 'DELETE',
			url: '/api/wiki/page/' + scope.id
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * محتوای صفحه را به قالب html تبدیل می‌کند.
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {String} محتوای صفحه در قالب html
	 */
	wikiPage.prototype.toHTML = function() {
		return markdown.toHTML(this.content);
	};
	return wikiPage;
});
