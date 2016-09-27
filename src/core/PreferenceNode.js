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
 * @name PPreferenceNode
 * @description
 *
 * یک تنظیم در سیستم را تعیین می‌کند. سیستم تنظیم‌ها به صورت یک درخت در نظر گرفته می‌شود
 * که در آن هر گره معادل با یک تنظیم در سیستم است. این سیستم برای ایجاد تنظیم‌های کاربری
 * در نمایش به کار گرفته می‌شود. برای نمونه زبان برنامه، لایه بندی آن و یا تم مورد استفاده از
 * مواردی است که در این تنظیم‌ها قرار می‌گیرد.
 *
 * این تنظیم‌ها سمت کاربر نگهداری می‌شود و برنامه کاربری می‌تواند آنها را برای اجرای بعدی نگهداری
 * کند.
 */
.factory('PPreferenceNode', function(PObject, $q, $timeout) {
	var pPreferenceNode = function() {
		PObject.apply(this, arguments);
	};
	pPreferenceNode.prototype = new PObject();
	/**
	 * یک بخش دجدید در تنظیم‌ها ایجاد می‌کند.
	 *
	 * بخش در حقیقت یک گره نامدار است که کاربران می‌توانند با استفاده از فراخوانی‌های در نظر
	 * گرفته شده به آن دسترسی داشته باشند.
	 * @memberof PPreferenceNode
	 * @param  {String} n نام گره جدید در تنظیم‌ها
	 * @return {promise(PPreferenceNode)} قول برای ایجاد گره جدید
	 */
	pPreferenceNode.prototype.newNode = function(n) {
		var def = $q.defer();
		// var scope = this;
		$timeout(function() {
			// var node = new PPreferenceNode();
			// scope.children[n] = node;
			// def.resolve(node);
			def.reject(n);
			//XXX: maso, 1395: ذخیره کرده تنظیم‌های جدید
		}, 1);
		return def.promise;
	};
	/**
	 * گره تعیین شده با نام را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof PPreferenceNode
	 * @param  {String} n نام گره مورد نظر
	 * @return {PaginatorPage(PPreferenceNode)}  زیرگره معادل
	 */
	pPreferenceNode.prototype.node = function() {
		//XXX: maso, 1395: از بین بچه‌ها گره مناسب را پیدا کرده و به عنو نتیجه برمی‌گرداند
	};
	/**
	 * تمام زیر گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد.
	 * @memberof PPreferenceNode
	 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}   گره‌ها به صورت صفحه بندی شده.
	 */
	pPreferenceNode.prototype.nodes = function() {
		//XXX: maso, 1395:
	};
	/**
	 * گره پدر را تعیین می‌کند.
	 * @memberof PPreferenceNode
	 * @return {promise(PPreferenceNode)} یک دستگیره برای انجام کار
	 */
	pPreferenceNode.prototype.parent = function() {
		//XXX: maso, 1395:
	};
	return pPreferenceNode;
});
