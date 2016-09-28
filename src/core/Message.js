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
 * @name PMessge
 * @description
 * یکی از سرویس‌هایی که در این بسته ارائه شده است، سیستم انتشار پیام است. این سیستم پیام‌های
 * کاربران دریافت و آنها را در قالب این کلاس منتشر می‌کند. این کلاس یک سری ابزارهای کاربردی
 * برای کار با این نوع پیام‌ها در اختیار سایر سیستم‌ها قرار می‌دهد.
 *
 */
.factory('PMessage', function() {
  var pMessage  = function(data) {
    if (data) {
      this.setData(data);
    }
  };
  /**
   * ساختار اولیه داده را در این کلاس ایجاد می‌کند.
   *
   * @memberof PMessage
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {PMessage}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pMessage.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * تعیین می‌کند که آیا نوع پیام معمولی است
   * @memberof PMessage
   * @return {boolean} درستی در صورت که نوع پیام معمولی باشد.
   */
  pMessage.prototype.isInfo = function(){
    return this.type === 'info';
  };

  /**
   * تعیین می‌کند که نوع پیام رفع خطا است
   * @memberof PMessage
   * @return {boolean} درستی در صورتی که نوع پیام رفع خطا باشد
   */
  pMessage.prototype.isDebug = function(){
    return this.type === 'debug';
  };

  /**
   * تعیین می‌کند که ایا پیام از نوع اخطار است.
   * @memberof PMessage
   * @return {boolean} درستی در صورتی که نوع اخطار باشد
   */
  pMessage.prototype.isWarning = function(){
    return this.type === 'warning';
  };

  /**
   * تعیین می‌کند که آیا پیام از نوع خطا است
   * @memberof PMessage
   * @return {boolean} درستی اگر پیام یک خطا باشد
   */
  pMessage.prototype.isError = function(){
    return this.type === 'error';
  };

  return pMessage;
});
