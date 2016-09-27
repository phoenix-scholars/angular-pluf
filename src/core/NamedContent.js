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
 * @name PNamedContent
 * @description
 * ساختار داده‌ای و ابزارهای مورد نیاز با یک محتوی نامدار را تعیین می‌کند. محتوی نام دار یک محتوی
 * است که با استفاده از یک نام منحصر به فرد قابل دسترسی است. از این مدل محتوی در جایی
 * استفاده می‌شود که شناسه محتوی مهم نیست و محتوی به هر شکلی باید موجود باشد.
 *
 * برای نمونه محتویی که در صفحه اول یک سایت نمایش داده می‌شود، مستقل از این که شناسه آن
 * چیست و در چه زمانی ایجاد شده است می‌تواند با نام مشخض به صورت زیر در دسترس باشد:
 *
 * <pre><code>
 * $cms.namedContent('main').then(function(nc){
 * 	$scope.namedContent = nc;
 * 	return nc.value();
 * }).then(function(content){
 * 	// Put content in your view
 * })
 * </code></pre>
 */
.factory('PNamedContent', function ($http, $httpParamSerializerJQLike, $q,
	PObject){
	var pNamedContent = function() {
		PObject.apply(this, arguments);
	};
	pNamedContent.prototype = new PObject();
	/**
	 * محتوی نامدار را به روز می‌کند.
	 * @memberof PNamedContent
	 * @return {promise} محتوی جدید
	 */
	pNamedContent.prototype.update = function(){
		// XXX: maso, 1395: به روز کردن صفحه
	};

	/**
	 * محتوی نامدار را از سیستم حذف می‌‌کند.
	 *
	 * @memberof PNamedContent
	 * @return {promise} محتوی حذف شده
	 */
	pNamedContent.prototype.remove = function(){
		// XXX: maso, 1395: حذف صفحه
	};
	// // XXX: maso, 1395: تعیین محتوی
	// pNamedContent.prototype.content = function(){
	// 	var deferred = $q.defer();
	// 	deferred.resolve(new PContent({id:2}));
	// 	return deferred.promise;
	// }
	/**
	 * محتوی این صفحه نامدار را تعیین می‌کند. این فراخوانی زمانیکه محتوی به صورت یم مقدار
	 * رشته‌ای و یا یک ساختار داده‌ای است بسیار مناسب است.
	 *
	 * @memberof PNamedContent
	 * @return {object} محتوی صفحه
	 */
	pNamedContent.prototype.value = function(){
		return this.content.value();
	};

	/**
	 * مقدار جدیدی را برای این محتوی نامدار تعیین می‌کند.
	 * @memberof PNamedContent
	 * @param  {object} v محتوی جدید
	 * @return {promise}   محتوی به روز شده
	 */
	pNamedContent.prototype.setValue = function(v){
		return this.content.setValue(v);
	};
	return pNamedContent;
});
