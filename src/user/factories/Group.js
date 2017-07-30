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
 * @name PGroup
 * @memberof pluf
 * 
 * @description
 * 
 */
.factory('PGroup',function(PObject,PObjectFactory, $injector, $pluf) {

	var _roleCache = new PObjectFactory(function(data) {
		if (!this.PRole) {
			this.PRole = $injector.get('PRole');
		}
		return new this.PRole(data);
	});
	var _userCache = new PObjectFactory(function(data) {
		if (!this.PGroup) {
			this.PUser = $injector.get('PUser');
		}
		return new this.PUser(data);
	});

	/*
	 * یک نمونه جدید از این موجودیت ایجاد می کند.
	 */
	var pGroup = function(data) {
		if (data) {
			this.setData(data);
		}
	};

	pGroup.prototype = new PObject();

	/**
	 * تغییرهای اعمال شده در ساختار داده‌ای پروفایل کاربری را به سرور انتقال
	 * می‌دهد. تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در
	 * این ساختار داده‌ای تنها در برنامه کاربر خواهد بود و با بارگذاری دوباره
	 * سیستم، به حالت اولیه برگردانده خواهد شد
	 * 
	 * @memberof PProfile
	 * 
	 * @return {promise(PProfile)} ساختار داده‌ای پرفایل کاربری
	 */
	pGroup.prototype.update = $pluf.createUpdate({
		method : 'POST',
		url : '/api/group/:id',
	});


	/**
	 * پروفایل کاربری را حذف می کند
	 * 
	 * @memberof PProfile
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف شده
	 */
	pGroup.prototype.remove = $pluf.createDelete({
		method : 'DELETE',
		url : '/api/group/:id'
	});
	pGroup.prototype.delete = pGroup.prototype.remove;

	/**
	 * حذف یک رول
	 * 
	 * برای حذف نقش باید خود نقش را داشته باشید.
	 * 
	 * @param {PRole}
	 *            نقش مورد نظر
	 * @return promise پارامتری برای خروجی در نظر گرفته نشده
	 */
	pGroup.prototype.removeRole = $pluf.createDeleteAss({
		method : 'DELETE',
		url : '/api/group/:id/role/{id}',
	}, _roleCache);

	/**
	 * فهرست نقش‌های گروه را تعیین می‌کند
	 * 
	 * @param PaginationParameter
	 * @return promise(PaginatedPage(Role))
	 */
	pGroup.prototype.roles = $pluf.createFind({
		method : 'GET',
		url : '/api/group/:id/role/find',
	}, _roleCache);


	/**
	 * Adds a role into the role list of a group
	 */
	pGroup.prototype.newRole = $pluf.createNew({
		method : 'POST',
		url : '/api/group/:id/role/new'
	}, _roleCache);

	/**
	 * کاربر رو حذف می‌کنه
	 * 
	 * معادل با حذف نقش کاربر هست.
	 * 
	 * @param {PUser}
	 *            کاربر مورد نظر
	 */
	pGroup.prototype.removeUser = $pluf.createDeleteAss({
		method : 'DELETE',
		url : '/api/group/:id/user/{id}',
	}, _userCache);

	/**
	 * فهرست کاربران را تعیین می‌کند
	 * 
	 */
	pGroup.prototype.users = $pluf.createFind({
		method : 'GET',
		url : '/api/group/:id/user/find',
	}, _userCache);

	/**
	 * Adds a user
	 */
	pGroup.prototype.newUser = $pluf.createNew({
		method : 'POST',
		url : '/api/group/:id/user/new'
	}, _userCache);

	return pGroup;
});
