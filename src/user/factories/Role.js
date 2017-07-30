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
.factory('PRole', function(PObject, PObjectFactory, $pluf, $injector) {

	var _userCache = new PObjectFactory(function(data) {
		if (!this.PGroup) {
			this.PUser = $injector.get('PUser');
		}
		return new this.PUser(data);
	});

	var _groupCache = new PObjectFactory(function(data) {
		if (!this.PGroup) {
			this.PGroup = $injector.get('PGroup');
		}
		return new this.PGroup(data);
	});

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
	pRole.prototype.update = $pluf.createUpdate({
		method : 'POST',
		url : '/api/role/:id'
	});

	/**
	 * پروفایل کاربری را حذف می کند
	 * 
	 * @memberof PProfile
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف
	 *          شده
	 */
	pRole.prototype.remove = $pluf.createDelete({
		method : 'DELETE',
		url : '/api/role/:id' 
	});


	/**
	 * کاربر رو حذف می‌کنه
	 * 
	 * معادل با حذف نقش کاربر هست.
	 * 
	 * @param {PUser}
	 *            کاربر مورد نظر
	 */
	pRole.prototype.removeUser = $pluf.createDeleteAss({
		method : 'DELETE',
		url : '/api/role/:id/user/{id}',
	}, _userCache);

	/**
	 * فهرست کاربران را تعیین می‌کند
	 * 
	 */
	pRole.prototype.users = $pluf.createFind({
		method : 'GET',
		url : '/api/role/:id/user/find',
	}, _userCache);

	/**
	 * Adds a user
	 */
	pRole.prototype.newUser = $pluf.createNew({
		method : 'POST',
		url : '/api/role/:id/user/new'
	}, _userCache);


	/**
	 * Deletes group ass.
	 * 
	 * @param {PGroup}
	 *                گروه مورد نظر
	 * @return {Promise<PGroup>}
	 */
	pRole.prototype.removeGroup = $pluf.createDeleteAss({
		method : 'DELETE',
		url : '/api/role/:id/group/{id}',
	});

	/**
	 * Lists all groups
	 * 
	 * @param {PaginationParameter}
	 * @return {Promise<PaginatedPage<PGroup>>}
	 */
	pRole.prototype.groups = $pluf.createGet({
		method : 'GET',
		url : '/api/role/:id/group/find',
	}, _groupCache);

	/**
	 * Adds new group
	 */
	pRole.prototype.newGroup = $pluf.createNew({
		method : 'POST',
		url : '/api/role/:id/group/new'
	}, _groupCache);



	return pRole;
});
