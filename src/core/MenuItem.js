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
 * @name PMenuItem
 * @description یک منو را ایجاد می‌کند
 * 
 * این کلاس یک گزینه از منو را ایجاد می‌کند. هر منو ایتم شامل دو دسته اطلاعات
 * می‌شود که یک دسته برای نمایش و یک دسته برای اجرا است. داده‌هایی که برای نمایش
 * به کار می‌روند محدودیت ندارند و کاربر هر کلید و یا مقداری را می‌تواند برای
 * آنها تعیین کند. اما داده‌های که برای اجرا به کار می‌روند محدود بود و باید
 * حتما مقادیر خاصی برای آنها تعیین شود.
 * 
 * @tutorial menuitem-command
 */
.factory('PMenuItem', function($window, $act) {
	var pMenuItem = function(data) {
		this.priority = 0;
		this.tags = [];
		if (data) {
			this.setData(data);
		}
	};
	/**
	 * داده‌های اولیه دستور را تعیین می‌کند.
	 * 
	 * @memberof PMenuItem
	 * @param {object}
	 *            data ساختار داده اولیه برای ایجاد دستور
	 * @return {pCommand} خود دستور به عنوان نتیجه برگردانده می‌ود.
	 */
	pMenuItem.prototype.setData = function(data) {
		if ('command' in data) {
			var scope = this;
			$act.getCommand(data.command).then(function(command) {
				angular.extend(scope, command);
				angular.extend(scope, data);
			});
		} else {
			angular.extend(this, data);
		}
		return this;
	};

	/**
	 * یک برچسب جدید به فهرست برچسب‌های این ایتم اضافه می‌کند. این برچسب‌ها برای
	 * دسته بندی کردن عمل‌ها در لایه نمایش کاربرد دارد.
	 * 
	 * @memberof PMenuItem
	 * @param {string}
	 *            tag برچسب جدید
	 * @return {PCommand} خود دستور را به عنوان نتیجه برمی‌گرداند.
	 */
	pMenuItem.prototype.tag = function(tag) {
		this.tags.push(tag);
	};

	/**
	 * منو را فعال کرده و برنامه‌های معادل با آن را اجرا می‌کند. بر اساس اینکه
	 * توی منو چه داده‌هایی قرار گرفته باشه، اجرا منو متفاوت هست. این فراخوانی
	 * به ترتیب داده‌های زیر را بررسی کرده و در صورت موجود بودن اجرا می‌کند:
	 * 
	 * <ul>
	 * <li>command</li>
	 * <li>actioin</li>
	 * <li>link</li>
	 * </ul>
	 * 
	 */
	pMenuItem.prototype.active = function() {
		if ('command' in this) {
			var args = [ this.command ];
			if (this.params instanceof Array) {
				args = args.concat(this.params);
			}
			return $act.execute.apply($act, args);
		} else if ('action' in this) {
			return this.action();
		} else if ('link' in this) {
			$window.location = this.link;
			return;
		}
		throw {
			status : 404,
			code : 523,
			message : 'Menu item is not supported'
		};
	};
	return pMenuItem;
});
