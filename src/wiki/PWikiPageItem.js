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
 * @name PWikiPageItem
 * @memberof wiki
 *
 * @description
 * ساختار داده‌ای یک آیتم از نوع صفحه با کمترین اطلاعات ممکن.
 *
 * @attr {Integer} id شناسه PageItem
 *
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 *
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 *
 */
.factory('PWikiPageItem', function(PObject) {

	var wikiPageItem = function(d) {
		if (d) {
			this.setData(d);
		}
	};

	wikiPageItem.prototype = new PObject();

	/**
	 * صفحه مربوط به این PageItem را برمی گرداند
	 *
	 * @memberof PWikiPageItem
	 * @returns {promise(PWikiPage)} صفحه مربوط به این PageItem
	 */
	wikiPageItem.prototype.page = function() {
		// TODO: پیاده‌سازی شود
	};

	return wikiPageItem;
});
