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
 * @ngdoc service
 * @name $news
 * @memberof saas
 *
 * @description
 * این سرویس امکاناتی نظیر ثبت و حذف follower ها و ارسال پیام به آن‌ها را مدیریت می‌کند
 */
.service('$news', function($httpParamSerializerJQLike, $http, $q, PException, PFollower,PaginatorPage){

	this._df = [];
	this._getf = function(i){
		return this._df[i];
	};
	this._retf= function(id, d){
		var i = this._getf(id);
		if (i) {
			i.setData(d);
			return i;
		}
		this._df[id] = new PFollower(d);
		return this._df[id];
	};


	this.validateFollower = function(f) {
		var def = $q.defer();
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(f)){
			def.resolve({
				type: 'email',
				address: f
			});
			return def.promise;
		}
		var mob = /^\+?\d{10,14}$/;
		if(mob.test(f)){
			def.resolve({
				type: 'mobile',
				address: f
			});
			return def.promise;
		}
		def.resolve({
			type: 'other',
			address: f
		});
		return def.promise;
	};

	// دنبالگرها
	this.newFollower = function(f){
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/newspaper/follower/new',
			data: $httpParamSerializerJQLike(f),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res){
			return scope._retf(res.data.id, res.data);
		});
	};
	this.followers = function(p){
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/newspaper/follower/find',
			params : p.getParameter()
		}).then(function(res){
			var page = new PaginatorPage(res.data);
			page.items = [];
			for (var i = 0; i < res.data.counts; i++) {
				page.items.push(scope._retf(res.data.items[i].id, res.data.items[i]));
			}
			return page;
		});
	};

	/**
	 * مشخصات دنبالگر را تعیین می‌کند.
	 *
	 * @return {promise<PFollower>} دنبالگر
	 */
	this.follower = function(){};
});
