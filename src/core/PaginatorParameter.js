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
 * @name PaginatorParameter
 * @description بسیاری از داده‌هایی که در سیستم موجود است به صورت صفحه بندی شده
 *              در اختیار کاربران قرار می‌گیرد. در این بخش ابزارهایی برای کار با
 *              صفحه بندی ارائه شده است.
 * 
 * 
 * از جمله خصوصیاتی که می‌توان در این ساختار قرار داد عبارتند از:
 * 
 * @attr {string} _px_q متن مورد جستجو در فیلدهای مختلف
 * @attr {Integer} _px_p شماره صفحه مورد نظر از فهرست صفحه‌بندی شده
 * @attr {Integer} _px_ps تعداد آیتم‌های موجود در هر صفحه
 * @attr {string} _px_fk نام خصوصیتی که برای فیلتر کردن مورد استفاده قرار
 *       می‌گیرد
 * @attr {string} _px_fv مقداری مورد نظر برای خصوصیتی که بر اساس آن فیلتر انجام
 *       می‌شود.
 * @attr {string} _px_sk نام خصوصیتی که فهرست باید بر اساس آن مرتب شود.
 * @attr {string} _px_so ترتیب مرتب‌سازی، اینکه مرتب‌سازی به صورت صعودی باشد یا
 *       نزولی
 * 
 */
.factory('PaginatorParameter', function() {
	var pagParam = function() {
		// init
		this.param = {};
		this.filterMap = {};
		this.sortMap = {};
		
		this._init_filters = function(){
			var obj = this.filterMap;
			this.param._px_fk = Object.keys(obj);
			// this.param._px_fv = Object.values(obj);
			this.param._px_fv = [];
			for(var index=0; index<this.param._px_fk.length; index++){
				var key = this.param._px_fk[index];
				this.param._px_fv[index] = obj[key];
			}
		};
		this._init_sorts = function(){
			var obj = this.sortMap;
			this.param._px_sk = Object.keys(obj);
			// this.param._px_so = Object.values(obj);
			this.param._px_so = [];
			for(var index=0; index<this.param._px_sk.length; index++){
				var key = this.param._px_sk[index];
				this.param._px_so[index] = obj[key];
			}
		};
	};

	pagParam.prototype = {
		setSize : function(size) {
			this.param._px_c = size;
			return this;
		},
		setQuery : function(query) {
			this.param._px_q = query;
			return this;
		},
		/**
		 * تعیین صفحه مورد نظر
		 * 
		 * این فراخوانی صفحه‌ای را تعیین می‌کند که مورد نظر کاربر است. برای
		 * نمونه اگر صفحه دوم از یک کاوش مد نظر باشد باید مقدار یک به عنوان
		 * ورودی این تابع استفاده شود.
		 * 
		 * اندیس تمام صفحه‌ها از صفر شروع می‌شود. بنابر این صفحه اول اندیس صفر و
		 * صفحه دوم اندیس یک دارد.
		 * 
		 * @param int
		 *            $page شماره صفحه
		 * @return PaginatorParameter خود شئی به عنوان خروجی برگردانده می‌شود.
		 */
		setPage : function($page) {
			this.param._px_p = $page;
			return this;
		},
		nextPage : function() {
			this.param._px_p += 1;
			return this;
		},

		setOrder : function($key, $order) {
			if(!$order){				
				this.removeSorter($key, $order);
			}else{				
				this.addSorter($key, $order);
			}
			this._init_sorts();
			return this;
		},
		addSorter : function($key, $order){
			if(!$order){
				return this;
			}
			this.sortMap[$key] = $order;
			this._init_sorts();
			return this;
		},
		removeSorter : function($key){
			delete this.sortMap[$key];
			this._init_sorts();
			return this;
		},
		clearSorters: function(){
			this.sortMap = {};
		},
		
		setFilter : function($key, $value) {
			if(!$value){				
				this.removeFilter($key, $value);
			}else{				
				this.addFilter($key, $value);
			}
			this._init_filters();
			return this;
		},
		addFilter : function($key, $value){
			if(!$value){
				return this;
			}
			this.filterMap[$key] = $value;
			this._init_filters();
			return this;
		},
		removeFilter : function($key){
			delete this.filterMap[$key];
			this._init_filters();
			return this;
		},
		clearFilters: function(){
			this.filterMap = {};
		},
		
		getParameter : function() {
			return this.param;
		},
		/**
		 * پارامترهای اضافه
		 * 
		 * در برخی از کاربردها نیاز به ارسال پارامترهای بیشتری به سرور هست. این
		 * فراخوانی امکان اضافه کردن پارامترهای اضافه را فراهم می‌کند.
		 * 
		 * @memberof PaginatorParameter
		 * @since 1.0.2
		 * 
		 * @param Object
		 *            value
		 * @param String
		 *            key کلید پارامتر مورد نظر
		 * @return خود موجودیت
		 */
		put : function(key, value) {
			this.param[key] = value;
			return this;
		},

		/**
		 * دسترسی به یک پارامترها خاص
		 * 
		 * این فراخوانی برای دسترسی به یک پارامتر خواص در نظر گرفته شده. این
		 * پارامترها معمولا به صورت اضافه برای سرور ارسال می‌شوند.
		 * 
		 * @memberof PaginatorParameter
		 * @since 1.0.2
		 * 
		 * @param String
		 *            key کلید پارامتر مورد نظر
		 * @return مقدار معادل با کلید
		 */
		get : function(key) {
			return this.param[key];
		}

	};
	return pagParam;
});
