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
 * @memberof pluf.saas
 * @name PTenant
 * @description ساختار داده‌ای یک ملک را تعیین می‌کنه
 */
.factory('PTenant',
		function($http, $httpParamSerializerJQLike, $window, $q, PObject) {
			var pTenant = function() {
				PObject.apply(this, arguments);
			};
			pTenant.prototype = new PObject();

			/**
			 * یک ملک را حذف می‌کند
			 * 
			 * @memberof PTenant
			 * @return {promise<PTenant>} ملک حذف شده
			 */
			pTenant.prototype.remove = function() {
				var scope = this;
				return $http({
					method : 'DELETE',
					url : '/api/tenant/' + this.id,
				}).then(function(res) {
					scope.setData(res.data);
					return scope;
				});
			};

			/**
			 * اطلاعات ملک را به روز می‌کند
			 * 
			 * @memberof PTenant
			 * @return {promise<PTenant>} خود ملک
			 */
			pTenant.prototype.update = function() {
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/tenant/' + this.id,
					data : $httpParamSerializerJQLike(this),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(res) {
					scope.setData(res.data);
					return scope;
				});
			};

			return pTenant;
		});
