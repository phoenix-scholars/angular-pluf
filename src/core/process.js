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
 * @ngdoc service
 * @name $process
 * @description
 * روی سرور دسته‌ای از پردازش‌ها در حال اجرا است. این سرویس تمام پردازش‌هایی
 * که سمت سرور ایجاد شده است را مدیریت می‌کند. این مدیریت تنها شامل فهرست کردن یا
 * کنترل کردن حالت یک پردازش است.
 *
 * این مدیریت قادر به ایجاد یک پردازش نیست بلکه تنها آنها را فهرست می‌کند. این پردازش‌ها معمولا
 * در ازای یک فراخوانی در سیستم ایجاد می‌شوند.
 *
 */
.service('$process', function() {

  /**
   * فهرست تمام پردازش‌هایی که روی سرور هست را تعیین می‌کند. این پردازش‌ها بر اساس سطح
   * دسترسی در اختیار کاربران قرار خواهد گرفت.
   *
   * @memberof $process
   * @return {promis(PaginatedPage(PProcess))} صفحه‌ای از پردازش‌ها
   */
  this.processes = function(){};
  /**
   * اطلاعات یک پردازش را در اختیار کابران قرار می‌دهد. تمام پردازش‌هایی که با این روش بازیابی
   * شوند توسط این سرویس ردیابی و مدیریت می‌شوند.
   *
   * @memberof $process
   * @param  {Number} id شناسه پردازش مورد نظر
   * @return {promis(PProcess)}    یک دستگیره که پردازش مورد نظر را بازیابی می‌کند.
   */
  this.process = function(){};
});
