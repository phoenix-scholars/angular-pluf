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
 * @name PUser
 * @memberof pluf
 * 
 * @description ساختار داده‌ای یک کاربر را در سیستم تعیین می‌کند. از این مدل
 *              برای مدیریت کردن اطلاعات کاربری استفاده می‌شود.
 * 
 * @attr {Integer} id شناسه
 * @attr {String} login نام کاربری به منظور لاگین کردن
 * @attr {String} password کلمه عبور کاربر برای لاگین کردن
 * @attr {String} first_name نام کاربر
 * @attr {String} last_name نام خانوادگی کاربر
 * @attr {String} email آدرس ایمیل کاربر
 * @attr {String} language زبان پیش‌فرض کاربر
 * @attr {String} timezone منطقه زمانی کاربر
 * @attr {Datetime} date_joined تاریخ و زمان ایجاد حساب
 * @attr {Datetime} last_login تاریخ و زمان آخرین لاگین
 * @attr {Boolean} administrator تعیین می‌کند که آیا این کاربر دسترسی ادمین دارد
 *       یا نه
 * @attr {Boolean} staff تعیین می‌کند که این کاربر دسترسی staff دارد یا نه
 * 
 * @attr {String} avatar مسیر اواتار رو تعیین می‌کنه و به صورت پویا ایجاد می‌شه.
 *       فرض این هست که شناسه کاربر در حین کار تغییر نمی‌کنه
 * 
 * از این موجودیت برای مدیریت (ایجاد، ویرایش و حذف) حساب کاربری استفاده می‌شود.
 * برای نمونه فرض کنید که می‌خواهیم نام یک کاربر را تغییر دهیم، برای این کار کد
 * زیر باید استفاده شود:
 * 
 * <pre><code>
 * 	var user;
 * 	...
 * 	user.first_name = 'new first name';
 * 	user.update().then(function(){
 * 		// user account is updated
 * 	});
 * </code></pre>
 * 
 * نکته: در صورتی که خصوصیت گذرواژه کاربری را تغییر دهید، این تغییر در سرور
 * اعمال خواهد شد.
 */
.factory('PUser',
	function($http, $q, $pluf, PObject, PObjectFactory, $injector) {

    var _profileCache = new PObjectFactory(function(data) {
	if (!this.PRole) {
	    this.PProfile = $injector.get('PProfile');
	}
	return new this.PProfile(data);
    });
    var _roleCache = new PObjectFactory(function(data) {
	if (!this.PRole) {
	    this.PRole = $injector.get('PRole');
	}
	return new this.PRole(data);
    });
    var _groupCache = new PObjectFactory(function(data) {
	if (!this.PGroup) {
	    this.PGroup = $injector.get('PGroup');
	}
	return new this.PGroup(data);
    });
    var _messageCache = new PObjectFactory(function(data) {
	if (!this.PMessage) {
	    this.PProfile = $injector.get('PMessage');
	}
	return new this.PMessage(data);
    });

    var pUser = function(data) {
	if (data) {
	    this.setData(data);
	    /*
	     * NOTE: فرض ما این هست که شناسه داره و این شناسه تغییر
	     * نمی‌کنه
	     */
	    this.avatar = '/api/user/' + this.id + '/avatar';
	}
    };

    pUser.prototype = new PObject();

    /**
     * اطلاعات حساب کاربری را به‌روزرسانی می‌کند
     * 
     * تغییراتی که در ساختارهای داده‌ای اعمال شده است را در سرور نیز
     * اعمال می‌کند. تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای
     * اعمال شده در این ساختار داده‌ای تنها در برنامه کاربر خواهد بود و
     * با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد.
     * 
     * @memberof PUser
     * 
     * @return {promise(PUser)} ساختار داده‌ای به‌روز شده‌ی حساب کاربری
     */
    pUser.prototype.update = $pluf.createUpdate({
	method : 'POST',
	url : '/api/user/:id',
    });

    // TODO: maso, document: پارامتر ورودی ساختاری با داده گذرواژه
    pUser.prototype.newPassword = $pluf.createUpdate({
	method : 'POST',
	url : '/api/user/:id/password',
    });

    /**
     * حساب کاربری را حذف می‌کند
     * 
     * @memberof PUser
     * 
     * @return {promise(PUser)} ساختار داده‌ای حساب کاربری حذف شده
     */
    pUser.prototype.delete = $pluf.createDelete({
	method : 'DELETE',
	url : '/api/user/:id'
    });

    /**
     * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی
     * به صورت هم زمان انجام می‌شود.
     * 
     * @memberof PUser
     * 
     * @return {boolean} حالت مدیر بودن کاربر
     */
    pUser.prototype.isAdministrator = function() {
	return (this.id && this.id > 0 && this.administrator);
    };

    /**
     * تعیین می‌کند که آیا کاربر جاری staff است یا نه. این فراخوانی به
     * صورت هم زمان انجام می‌شود.
     * 
     * @memberof PUser
     * 
     * @return {boolean} حالت staff بودن کاربر
     */
    pUser.prototype.isStaff = function() {
	return (this.id && this.id > 0 && this.staff);
    };

    /**
     * پروفایل کاربر را تعیین می‌کند.
     * 
     * @memberof PUser
     * 
     * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری مربوط
     *          به این حساب کاربری
     */
    pUser.prototype.profile = $pluf.createGet({
	method : 'GET',
	url : '/api/user/:id/profile',
    }, _profileCache);

    /**
     * حذف یک رول از کاربر
     * 
     * برای حذف نقش باید خود نقش را داشته باشید.
     * 
     * @param {PRole}
     *                نقش مورد نظر
     * @return promise پارامتری برای خروجی در نظر گرفته نشده
     */
    pUser.prototype.removeRole = function(role) {
	return $http({
	    method : 'DELETE',
	    url : '/api/user/' + this.id + '/role/' + role.id,
	});
    };

    /**
     * فهرست نقش‌های کاربر را تعیین می‌کند
     * 
     * @param PaginationParameter
     * @return promise(PaginatedPage(Role))
     */
    pUser.prototype.roles = $pluf.createFind({
	method : 'GET',
	url : '/api/user/:id/role/find',
    }, _roleCache);
    
    /**
     * Crate a new role 
     */
    pUser.prototype.newRole = $pluf.createNew({
	method : 'POST',
	url : '/api/user/:id/role/new'
    }, _roleCache);

    /**
     * رابطه میان گروه و کاربر را حذف می کند.
     * 
     * پارامتر ورودی باید یک گروه باشد.
     * 
     * @param {PGroup}
     *                گروه مورد نظر
     * @return {Promise<PGroup>}
     */
    pUser.prototype.removeGroup = function(group) {
	return $http({
	    method : 'DELETE',
	    url : '/api/user/' + this.id + '/group/' + group.id,
	});
    };

    /**
     * فهرست گروه‌هایی را تعیین می‌کند که کاربر در آنها است
     * 
     * @param {PaginationParameter}
     * @return {Promise<PaginatedPage<PGroup>>}
     */
    pUser.prototype.groups = $pluf.createGet({
	method : 'GET',
	url : '/api/user/:id/group/find',
    }, _groupCache);

    pUser.prototype.newGroup = $pluf.createNew({
	method : 'POST',
	url : '/api/user/:id/group/new'
    }, _roleCache);

    /**
     * 
     */
    pUser.prototype.messages = $pluf.createFind({
	method : 'GET',
	url : '/api/user/:id/message/find',
    }, _messageCache);

    return pUser;
});
