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
 * @name PMenu
 * @description
 * یک منو در حقیقت یک فهرست از منو ایتم‌ها است که در نمایش‌ها به کار گرفته می‌شود. برنامه‌ها
 * می‌توانند منوهای مورد نظر خود را ثبت کرده و در در مکان‌های مورد نظر به کار ببرند. برای ایجاد
 * یک منو می‌توان به دو روش عمل کرد:
 *
 * - ایجاید یک نمونه از این موجودیت
 * - استفاده از سرویس $menu
 *
 * منوهای که به صورت مستقیم ایجاد بشن در سیستم مدیریت منوها ثبت نیستند و نمی‌شه مجدد از آنها
 * استفاده کرد. بهترین روش برای ایجاد یک منو استفاده از سرویس $menu است.
 *
 * @attr {PMenuItem} items فهرست تمام منوها و منوایتم‌هایی که توی این منو قرار دارند. این
 * خصوصیت یکی از مهم‌ترین خصوصیت‌های منو است.
 *
 * @attr {string[]} tags فهرستی از برچسب‌ها را تعیین می‌کند که به این منو داده می‌شود. از
 * این برچسب‌ها برای دسته بندی منوها استفاده می‌شود.
 *
 * @attr {integer} priority
 * اولویت این منو را تعیین می‌کند. در مواردی که نیاز است چندین منو با هم نمایش داده شوند از این
 * خصوصیت برای مرتب ساز آنها استفاده می‌شود.
 *
 * @example
 * <ul>
 * 	<li ng-repete="m in menu.items"
 * 		ng-click="m.active()"
 * 		ng-show="m.visible()">{{m.label}}</li>
 * </ul>
 */
.factory('PMenu', function() {
  var pMenu  = function(data) {
    this.priority = 0;
    this.tags = [];
    if (data) {
      this.setData(data);
    }
    this.items = [];
  };
  /**
   * داده‌های اولیه دستور را تعیین می‌کند.
   *
   * @memberof PMenu
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {PMenu}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pMenu.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * یک دستگیره جدید را به فهرست دستگیره‌های موجود در این دستور اضافه می‌کند.
   *
   * @memberof PMenu
   * @param  {PHandler} handler دستگیره جدید برای این دستور
   * @return {PMenu}   خود دستور به عنوان نتیجه برگردانده می‌شود.
   */
  pMenu.prototype.item = function(h){
    this.items.push(h);
    return this;
  };
  /**
   * یک برچسب جدید به منو اضافه می‌کند. مهم‌ترین کاربرد این برچسب‌ها فهرست کردن و نمایش دسته
   * بندی شده منوها است.
   *
   * @memberof PMenu
   * @param  {string} tag برچسب جدید
   * @return {PMenu}   خود دستور را به عنوان نتیجه برمی‌گرداند.
   */
  pMenu.prototype.tag = function(tag){
    this.tags.push(tag);
  };
  return pMenu;
});
