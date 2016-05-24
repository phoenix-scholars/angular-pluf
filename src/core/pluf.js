/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	// 'use strict';
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
	angular
		.module('pluf', [])
		.run(function($usr, $act) {
			$act.command({
				id : 'pluf.user.login',
				label : 'login',
				description : 'login a user',
				visible : function() {
					return $usr.isAnonymous();
				},
				category : 'usr',
			}).commandHandler({
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
			}).commandHandler({
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
			}).commandHandler({
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
			})
			/*
			 *
			 */
			.commandHandler({
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

//End
})();
