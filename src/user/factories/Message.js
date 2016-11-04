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
 * @name PProfile
 * @memberof pluf
 * 
 * @description هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری
 *              اطلاعات کلی می‌شود. این اطلاعات برای هر نرم افزار می‌تواند
 *              متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل دارید که
 *              شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره
 *              دانشجویی است.
 * 
 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید
 * مقدار باشد که شما می‌توانید مقادیر مورد نظر خود را در آن اضافه و کم کنید.
 * 
 * @attr {Integer} id شناسه
 * @attr {Integer} user شناسه حساب کاربری مربوط به این پروفایل
 * @attr {Boolean} validate وضعیت اعتبار پروفایل
 * @attr {String} country کشور
 * @attr {String} city شهر
 * @attr {String} address آدرس
 * @attr {String} postal_code کد پستی
 * @attr {String} phone_number شماره تلفن
 * @attr {String} mobile_number شماره موبایل
 * @attr {String} national_id کد ملی
 * @attr {String} shaba شماره شبای بانکی
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد پروفایل
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory('pMessage', function(PObject) {
    /*
     * یک نمونه جدید از این موجودیت ایجاد می کند.
     */
    var pMessage = function(data) {
	if (data) {
	    this.setData(data);
	}
    };

    pMessage.prototype = new PObject();

    /**
     * پروفایل کاربری را حذف می کند
     * 
     * @memberof PProfile
     * 
     * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف شده
     */
    pMessage.prototype.remove = $pluf.createDelete({
	method : 'DELETE',
	url : '/api/user/:user/message/:id'
    });

    return pMessage;
});