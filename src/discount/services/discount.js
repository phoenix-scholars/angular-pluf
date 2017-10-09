/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $cms
 * 
 * @description این سرویس برای کار با تخفیف‌هاست. این سرویس برای جستجو و یا گرفتن
 *              اطلاعات تخفیف‌های مختلف کاربرد دارد.
 *               
 * هر تخفیف یک کد تخفیف دارد. برای گرفتن اطلاعات یک تخفیف می‌تونید موجودیت تخفیف رو به صورت زیر بگیرید:
 * 
 * <pre><code>
 * $discount.discount('discount_code').then(function(di) {
 * 	...
 * });
 * </code></pre>
 */ 
.service(
		'$discount',
		function($http, $httpParamSerializerJQLike, $q, $timeout, PDiscount, PDiscountType,
				PaginatorPage, PObjectCache, $pluf) {
			var _cache = new PObjectCache(function(data) {
				return new PDiscount(data);
			});
			this._cache = _cache;

			var _discountTypeCache = new PObjectCache(function(data) {
				return new PDiscountType(data);
			});

			/**
			 * این فراخوانی یک ساختار داده‌ای جدید ایجاد می‌کند.
			 * 
			 * @memberof $discount
			 * @param {PDiscount}
			 *            discount ساختار داده‌ای تخفیف برای ایجاد
			 * @return {promise(PDiscount)}
			 */
			this.newDiscount = $pluf.createNew({
				method : 'POST',
				url : '/api/discount/new'
			}, _cache);

			/**
			 * یک تخفیف با شناسه یا کد خاص را برمی گرداند.
			 * 
			 * @memberof $discount
			 * @param {Integer | String}
			 *            شناسه یا کد تخفیف
			 * @return {promise(PDiscount)} تخفیف معادل
			 */
			this.discount = $pluf.createGet({
				method : 'GET',
				url : '/api/discount/{id}'
			}, _cache);

			/**
			 * فهرست تمام تخفیف‌های موجود را تعیین می‌کند
			 * 
			 * @memberof $discount
			 * @param {PaginatorParameter}
			 *            param پارامترهای جستجو
			 * @return {promise(PaginatorPage(PDiscount))} نتیجه جستجو
			 */
			this.discounts = $pluf.createFind({
				method : 'GET',
				url : '/api/discount/find'
			}, _cache);
			
			/**
			 * یک نوع تخفیف را با نوع تعیین شده را برمی گرداند.
			 * 
			 * @memberof $discount
			 * @param {String}
			 *            نوع تخفیف
			 * @return {promise(PDiscountType)} نوع تخفیف معادل
			 */
			this.discountType = $pluf.createGet({
				method : 'GET',
				url : '/api/discount/type/{id}'
			}, _cache);
			
			/**
			 * فهرست تمام تخفیف‌های موجود را تعیین می‌کند
			 * 
			 * @memberof $discount
			 * @param {PaginatorParameter}
			 *            param پارامترهای جستجو
			 * @return {promise(PaginatorPage(PDiscount))} نتیجه جستجو
			 */
			this.discountTypes = $pluf.createFind({
				method : 'GET',
				url : '/api/discount/type/find'
			}, _cache);
			
		});
