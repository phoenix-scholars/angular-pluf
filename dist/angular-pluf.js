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
/**
 * @ngdoc module
 * @name pluf.core
 * @description
 *
 * ساختارهای داده‌ای پایه‌ای و مدیریت آنها در این ماژول پیاده سازی شده است. این ساختارهای داده‌ای
 * کاربردهای مانند مدیریت خطا، صفحه بندی و ساختار اولیه موجودیت‌ها در سیستم را ایجاد می‌کند. این
 * ساختارها در تمام ماژولها در دسترس است.
 *
 */
angular.module('pluf', [])
.run(function($usr, $act, PException) {
	$act.command({
		id : 'pluf.user.login',
		label : 'login',
		description : 'login a user',
		visible : function() {
			return $usr.isAnonymous();
		},
		category : 'usr',
	})
	.handler({
		commandId : 'pluf.user.login',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('no credentioal');
			}
			var a = arguments[0];
			return $usr.login(a.username, a.password);
		}
	})

	/**
	 * خروج کاربر جاری از سیستم
	 */
	.command({
		id : 'pluf.user.logout',
		label : 'logout',
		description : 'logout the user',
		visible : function() {
			return !$usr.isAnonymous();
		},
		category : 'usr',
	}).handler({
		commandId : 'pluf.user.logout',
		handle : function() {
			return $usr.logout();
		}
	})

	/**
	 * دستور به روز کردن اطلاعات کاربر جاری
	 */
	.command({
		id : 'pluf.user.update',
		label : 'update',
		description : 'update the current user',
		visible : function() {
			return !$usr.isAnonymous();
		},
	}).handler({
		commandId : 'pluf.user.update',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('bad param');
			}
			var a = arguments[0];
			return $usr.session().then(function(user) {
				return user.update(a.key, a.value);
			});
		}
	})
	/*
	 *
	 */
	.command({
		id : 'pluf.user.profile.update',
		label : 'update profile',
		description : 'update user profile',
		visible : function() {
			return !$usr.isAnonymous();
		},
	}).handler({
		commandId : 'pluf.user.profile.update',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('bad param');
			}
			var a = arguments[0];
			return $usr.session().then(function(user) {
				return user.profile();
			}).then(function(profile) {
				return profile.update(a.key, a.value);
			});
		}
	});
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	'use strict';
	/**
	 * امکانات اولیه برای مکان‌یابی را در اختیار کاربران قرار می‌دهد.
	 */
	angular.module('pluf.social', ['pluf']);

})();
