/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
//
//angular.module('pluf.jahanjoo')
//
///**
// * فراخوانی‌ها اولیه سیستم، مانند جستجو و فهرست کردن را فراهم می‌کند.
// */
//.service(
//		'$jahanjoo',
//		function($rootScope, $http, $q, $window, $usr, PLocation,
//				PaginatorPage, PException) {
//			this._pool = [];
//			/**
//			 * یک نمونه جدید از این کلاس ایجاد کرده و اون رو توی مخزن می‌زاره
//			 */
//			this.ret = function(d) {
//				if (d.id in this._pool) {
//					var t = this._pool[d.id];
//					t.setData(d);
//					return t;
//				}
//				var t = new PLocation(d);
//				this._pool[t.id] = t;
//				return t;
//			}
//			/**
//			 * گرفتن اطلاعات یک مکان
//			 */
//			this.location = function(i) {
//				if (i in this._pool) {
//					var d = $q.defer();
//					d.resolve(this._pool[i]);
//					return d.promise;
//				}
//				var scope = this;
//				return $http({
//					method : 'GET',
//					url : '/api/jayab/location/' + i,
//				}).then(function(res) {
//					return scope.ret(res.data);
//				}, function(res) {
//					throw new PException('fail to get locations.', res.data);
//				});
//			}
//			/**
//			 * فهرستی از تمام مکان‌های اضافه شده در سیستم.
//			 */
//			this.locations = function(p) {
//				var scope = this;
//				return $http({
//					method : 'GET',
//					url : '/api/jayab/location/list',
//					params : p.getParameter(),
//				}).then(function(res) {
//					var page = new PaginatorPage(res.data);
//					var items = [];
//					for (var i = 0; i < page.counts; i++) {
//						var t = scope.ret(page.items[i]);
//						items.push(t);
//					}
//					page.items = items;
//					return page;
//				}, function(res) {
//					throw new PException('fail to get locations.', res.data);
//				});
//			}
//			/**
//			 * یک مکان جدید را در سیستم تعریف می‌کند این مکان باید به صورت زیر
//			 * ایجاد بشه: { name: title, description: description, latitude:
//			 * lat, longitude: long, }
//			 */
//			this.add = function(p) {
//				var scope = this;
//				return $http({
//					method : 'POST',
//					url : '/api/jayab/location/create',
//					params : p,
//					headers : {
//						'Content-Type' : 'application/x-www-form-urlencoded'
//					}
//				}).then(function(res) {
//					return scope.ret(res.data);
//				}, function(res) {
//					throw new PException('fail to add location.', res.data);
//				});
//			}
//		});
