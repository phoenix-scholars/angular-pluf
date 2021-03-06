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
 * @name PWikiPage
 * @memberof pluf.wiki
 * 
 * @description ساختار داده‌ای یک صفحه به همراه اطلاعات کامل صفحه.
 * 
 * @attr {Integer} id شناسه صفحه
 * 
 * @attr {Integer} priority با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب
 *       در نظر گرفت
 * 
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 * @attr {Integer} book شناسه کتابی که این صفحه متعلق به آن است
 * @attr {String} language زبان مورد استفاده در متن صفحه
 * @attr {String} summary خلاصه‌ای از متن صفحه
 * @attr {Blob} content محتوای صفحه
 * 
 * @attr {String} content_type نوع متن صفحه. مثلا: text/html, text/plain,
 *       text/markdown , ...
 * 
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد page
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */

.factory('PPage', function($http, $httpParamSerializerJQLike, PObject) {

	var pPage = function(data) {
		if (data) {
			this.setData(data);
		}
	};
	pPage.prototype = new PObject();

	/**
	 * اطلاعات یک صفحه را به‌روزرسانی می‌کند.
	 * 
	 * @memberof PWikiPage
	 * 
	 * @returns {promise(PWikiPage)} صفحه به‌روزرسانی شده
	 */
	pPage.prototype.update = function() {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/book/' + this.book + '/page/' + this.id,
			data : $httpParamSerializerJQLike(this),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};

	/**
	 * صفحه را حذف می‌کند
	 * 
	 * @memberof PWikiPage
	 * 
	 * @returns {promise(PWikiPage)} صفحه حذف شده برگردانده می شود
	 */
	pPage.prototype.remove = function() {
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/book/' + this.book + '/page/' + this.id
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};

	/**
	 * محتوای صفحه را به قالب html تبدیل می‌کند.
	 * 
	 * @memberof PWikiPage
	 * 
	 * @returns {String} محتوای صفحه در قالب html
	 */
	pPage.prototype.toHTML = function() {
		return markdown.toHTML(this.content);
	};
	return pPage;
});
