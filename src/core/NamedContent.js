/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
