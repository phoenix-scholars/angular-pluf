/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc factory
 * @name PObject
 * 
 * @description یک مخزن برای نگهداری تمام موجودیت‌هایی است که از ساختارهای
 *              داده‌ای ما پیروی می‌کنند.
 * 
 */
.factory('PObjectCache', function() {
	/**
	 * این فراخوانی یک نمونه جدید از این موجودیت ایجاد کرده و مقادیر داده ورودی
	 * را به عنوان داده‌های این موجودیت قرار می‌دهد.
	 * 
	 * @memberof PObject
	 * @param {data}
	 *            ساختار داده‌ای موجودیت مورد نظر
	 */
	var pObjectCache = function(factory) {
		this._cache = [];
		this.factory = factory;
	};

	/*
	 * اطلاعات یک کاربر با شناسه تعیین شده را بازیابی می‌کند. این مقدار ممکن است
	 * تهی باشد.
	 */
	pObjectCache.prototype.getObject = function(id) {
		if (!this._cache[id]) {
			return null;
		}
		if (this._cache[id].isAnonymous() || this._cache[id].isExpired()) {
			delete this._cache[id];
			return null;
		}
		return this._cache[id];
	};
	/*
	 * اطلاعات یک کاربر را بازیابی می‌کند
	 */
	pObjectCache.prototype.restor = function(id, data) {
		var instance = this.getObject(id);
		if (instance) {
			instance.setData(data);
		} else {
			instance = this.factory(data);
			this._cache[id] = instance;
		}
		return instance;
	};

	return pObjectCache;
});
