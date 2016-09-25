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
.factory('PGroup', function(PObject
// $http, $httpParamSerializerJQLike, $q,
) {
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
	pGroup.prototype.update = function() {
		// if (this.user.isAnonymous()) {
		// var deferred = $q.defer();
		// deferred.reject();
		// return deferred.promise;
		// }
		// var scope = this;
		// return $http({
		// method : 'POST',
		// url : '/api/user/'+ this.user.id + '/profile',
		// data : $httpParamSerializerJQLike(scope),
		// headers : {
		// 'Content-Type' : 'application/x-www-form-urlencoded'
		// }
		// }).then(function(res) {
		// scope.setData(res.data);
		// return scope;
		// });
	};

	/**
	 * پروفایل کاربری را حذف می کند
	 * 
	 * @memberof PProfile
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف شده
	 */
	pGroup.prototype.remove = function() {
		// var scope = this;
		// return $http({
		// method : 'DELETE',
		// url : '/api/user/' + this.user + '/profile',
		// data : $httpParamSerializerJQLike(scope),
		// headers : {
		// 'Content-Type' : 'application/x-www-form-urlencoded'
		// }
		// }).then(function(data){
		// scope.setData(data.data);
		// return scope;
		// });
	};
	pGroup.prototype.removeRole = function() {
	};
	pGroup.prototype.roles = function() {
	};

	pGroup.prototype.removeUser = function() {
	};
	pGroup.prototype.users = function() {
	};

	return pGroup;
});
