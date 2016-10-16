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
 * دستگیره‌ها
 * 
 * تمام دستورهای و دستگیره‌هایی که در رابطه با این ماژول وجود دارد را در این
 * پرونده اضافه شده است. این دستورها برای کاربردهای عمومی به کار می‌رود.
 */
.run(function($window, $act, $saas, PException) {
	/**
	 * اضافه کردن دستورها و دستگیره‌ها
	 */
	$act
	// Lunch an application
	.handler({
		command : 'tenant.lunch',
		handle : function() {
			if (arguments.length < 1) {
				throw new PException('tenant not found');
			}
			var tenantId = arguments[0];
			return $saas.get(tenantId)//
			.then(function(tenant) {
				return tenant.defaultApplication();
			}).then(function(app) {
				return app.run();
			});
		}
	})
	// run spa
	.handler({
		command : 'spa.lunch',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('application not found');
			}
			var spaId = arguments[0];
			return $saas.session()//
			.then(function(tenant) {
				return tenant.app(spaId);
			}).then(function(app) {
				return app.run();
			});
		}
	});
});