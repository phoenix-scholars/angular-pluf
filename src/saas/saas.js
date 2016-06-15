/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc service
 * @name $saas
 * @memberof pluf.saas
 * @description
 * مدیریت ملک و نرم افزارها را انجام می‌دهد.
 */
.service('$saas', function (
		$http, $httpParamSerializerJQLike, $q, $window,
		$act, $usr,
		PTenant, PSpa,
		PException, PaginatorParameter,	PaginatorPage
	) {
	/*
	 * مدیریت ملکها در حافظه انجام می‌دهد
	 */
	this._tenant = [];
	this._retTenant = function(tenantData) {
		var t;
		if (tenantData.id in this._tenant) {
			t = this._tenant[tenantData.id];
			t.setData(tenantData);
			return t;
		}
		t = new PTenant(tenantData);
		this._tenant[t.id] = t;
		return t;
	};
	/*
	 * مدیریت نرم افزارها در حافظه
	 */
	this._spa = [];
	this._retSpa = function(spaData){
		var t;
		if (spaData.id in this._spa) {
			t = this._spa[spaData.id];
			t.setData(spaData);
			return t;
		}
		t = new PSpa(spaData);
		this._tenant[t.id] = t;
		return t;
	};

	/**
	 * نمونه جاری را تعیین می‌کند. به صورت پیش فرض اجرای هر نرم افزار روی یک ملک اجرا
	 * می‌شود این فراخوانی ملکی را تعیین می‌کند که نرم افزار جاری روی آن کار می‌کند.
	 *
	 * @memberof $saas
	 * @return {permision(PTenant)} ملک جاری را تعیین می‌کند.
	 */
	this.session = function() {
		var scope = this;
		return $http.get('/api/saas/tenant').then(function(res) {
			return scope.ret(res.data);
		});
	};

	/**
	 * فهرست ملک‌هایی را تعیین می‌کند که کاربر جاری مالکیت آنها را دارد و یا اینکه در آنها عضویت
	 * دارد.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter خصوصیت‌های صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} ملک‌های صفحه بندی شد
	 */
	this.mine = function(paginatorParameter) {
		if (!paginatorParameter) {
			paginatorParameter = new PaginatorParameter();
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/app/userList',
			params: paginatorParameter.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			page.items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope.ret(res.data.items[i]);
				page.items.push(t);
			}
			return page;
		});
	};

	/**
	 * فهرست تمام ملک‌هایی را که کاربر به آنها دسترسی دارد را تعیین می‌کند.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} فهرست ملک‌ها به صورت صفحه بندی
	 */
	this.tenants = function(paginatorParameter) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/tenant/find',
			params: paginatorParameter.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			page.items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope.ret(res.data.items[i]);
				page.items.push(t);
			}
			return page;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * ملک تعیین شده با شناسه را برمی‌گرداند.
	 *
	 * @memberof $saas
	 * @param  {integer} id شناسه ملک مورد نظر
	 * @return {promise<PTenant>} ملک تعیین شده.
	 */
	this.tenant = function(id) {
		var scope = this;
		return $http.get('/api/saas/app/' + id)//
		.then(function(res) {
			return scope.ret(res.data);
		}, function(res) {
			throw new PException(res.data);
		});
	};

	/**
	 * یک ملک جدید ایجاد می‌کند و  ساختار ایجاد شده برای آنرا به عنوان نتیجه برمی‌گرداند.
	 *
	 * @memberof $saas
	 * @param  {Struct} tenantData ساختار داده‌ای ملک
	 * @return {promise<PTenant>} مکل ایجاد شده
	 */
	this.newTenant = function(t) {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/saas/app/create?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=14513358957011',
			data: $httpParamSerializerJQLike(t),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			return scope.ret(res.data);
		}, function(res) {
			throw new PException(res.data);
		});
	};

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم افزارها
	 */
	this.spas = function(){};

	/**
	 * نرم افزار معادل با شناسه ورودی را بازیابی می‌کند.
	 *
	 * @memberof $saas
	 * @param  {integer} id شناسه نرم افزار
	 * @return {promise<PSpa>} نرم‌افزار معادل
	 */
	this.spa = function(){};

	/**
	 * یک نرم افزار جدید در سیستم ایجاد می‌کند.
	 *
	 * @memberof $saas
	 * @param  {Struct} spa ساختار داده‌ای یک spa
	 * @return {promise<PSpa} نرم‌افزار معادل ایجاد شده
	 */
	this.newSpa = function(){};
});
