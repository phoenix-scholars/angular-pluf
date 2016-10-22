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
 * @name PProfile
 * @memberof pluf
 * 
 * @description هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری
 *              اطلاعات کلی می‌شود. این اطلاعات برای هر نرم افزار می‌تواند
 *              متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل دارید که
 *              شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره
 *              دانشجویی است.
 * 
 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید
 * مقدار باشد که شما می‌توانید مقادیر مورد نظر خود را در آن اضافه و کم کنید.
 * 
 * @attr {Integer} id شناسه
 * @attr {Integer} user شناسه حساب کاربری مربوط به این پروفایل
 * @attr {Boolean} validate وضعیت اعتبار پروفایل
 * @attr {String} country کشور
 * @attr {String} city شهر
 * @attr {String} address آدرس
 * @attr {String} postal_code کد پستی
 * @attr {String} phone_number شماره تلفن
 * @attr {String} mobile_number شماره موبایل
 * @attr {String} national_id کد ملی
 * @attr {String} shaba شماره شبای بانکی
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد پروفایل
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory(
	'PRole',
	function(PObject, $http, $httpParamSerializerJQLike, $q, $injector,
		PaginatorPage) {
	    /*
	     * یک نمونه جدید از این موجودیت ایجاد می کند.
	     */
	    var pRole = function(data) {
		if (data) {
		    this.setData(data);
		}
	    };

	    pRole.prototype = new PObject();

	    /**
	     * تغییرهای اعمال شده در ساختار داده‌ای پروفایل کاربری را به سرور
	     * انتقال می‌دهد. تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای
	     * اعمال شده در این ساختار داده‌ای تنها در برنامه کاربر خواهد بود و
	     * با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد
	     * 
	     * @memberof PProfile
	     * 
	     * @return {promise(PProfile)} ساختار داده‌ای پرفایل کاربری
	     */
	    pRole.prototype.update = function() {
		if (this.isAnonymous()) {
		    var deferred = $q.defer();
		    deferred.reject();
		    return deferred.promise;
		}
		var scope = this;
		return $http({
		    method : 'POST',
		    url : '/api/role/' + this.id,
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
	     * پروفایل کاربری را حذف می کند
	     * 
	     * @memberof PProfile
	     * 
	     * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف
	     *          شده
	     */
	    pRole.prototype.remove = function() {
		var scope = this;
		return $http({
		    method : 'DELETE',
		    url : '/api/role/' + this.id,
		    data : $httpParamSerializerJQLike(scope),
		    headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		    }
		}).then(function(data) {
		    scope.setData(data.data);
		    return scope;
		});
	    };

	    /**
	     * کاربر رو حذف می‌کنه
	     * 
	     * معادل با حذف نقش کاربر هست.
	     * 
	     * @param {PUser}
	     *                کاربر مورد نظر
	     */
	    pRole.prototype.removeUser = function(user) {
		return $http({
		    method : 'DELETE',
		    url : '/api/role/' + this.id + '/user/' + user.id,
		});
	    };

	    /**
	     * فهرست کاربران را تعیین می‌کند
	     * 
	     */
	    pRole.prototype.users = function(paginationParam) {
		// TODO: mao, 1395: replase with $pluf service
		var params = {};
		if (paginationParam) {
		    params = paginationParam.getParameter();
		}
		return $http({
		    method : 'GET',
		    url : '/api/role/' + this.id + '/user/find',
		    params : params
		}).then(function(res) {
		    var $usr = $injector.get('$usr');
		    var page = new PaginatorPage(res.data);
		    var items = [];
		    for (var i = 0; i < page.counts; i++) {
			var item = page.items[i];
			items.push($usr._userCache.restor(item.id, item));
		    }
		    page.items = items;
		    return page;
		});
	    };

	    /**
	     * گروه رو حذف می‌کنه
	     * 
	     * این فراخوانی معادل با حذف یک نقش از یک گروه هست.
	     * 
	     * 
	     */
	    pRole.prototype.removeGroup = function(group) {
		return $http({
		    method : 'DELETE',
		    url : '/api/role/' + this.id + '/group/' + group.id,
		});
	    };

	    /**
	     * فهرست گوره‌هایی که در این نقش هستند
	     */
	    pRole.prototype.groups = function(paginationParam) {
		var params = {};
		if (paginationParam) {
		    params = paginationParam.getParameter();
		}
		return $http({
		    method : 'GET',
		    url : '/api/role/' + this.id + '/group/find',
		    params : params
		}).then(function(res) {
		    var $usr = $injector.get('$usr');
		    var page = new PaginatorPage(res.data);
		    var items = [];
		    for (var i = 0; i < page.counts; i++) {
			var item = page.items[i];
			items.push($usr._groupCache.restor(item.id, item));
		    }
		    page.items = items;
		    return page;
		});
	    };
	    return pRole;
	});
