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
 * @name $bank
 * @description
 * 
 * سرویس انجام کارهای بانکی.
 * 
 * مهم‌ترین کاری که برای این سرویس در نظر گرفته شده است ایجاد یک پرداخت جدید در
 * سیستم است.
 * 
 * <pre><code>
 * // اجرای دستور
 * $bank.receipt({...}).then(function(receipt) {
 * 	// handle new receipt
 * });
 * </code></pre>
 * 
 * بعد از اینکه پرداخت در سیستم ایجاد شد کاربر می تونه برای پرداخت آن از درگاه
 * تعیین شده اقدام کنه.
 * 
 * Gate way link is placed in receipt.
 * 
 * <pre><code>
 * $bank.receipt({...}).then(function(receipt) {
 * 	var ulr = receipt.callUrl;
 * });
 * </code></pre>
 * 
 * Users must go to callUrl to pay.
 * 
 * A receipt is accessable with secure_id.
 * 
 */
.service( '$calendar', function($pluf, PCalendar, PEvent, PObjectCache) {

    var _calendarCache = new PObjectCache(function(data) {
	return new PCalendar(data);
    });

    var _eventCache = new PObjectCache(function(data) {
	return new PEvent(data);
    });

    /**
     * Creates new calendar
     * 
     * @memberof $calendar
     * @return Promise<PCalendar>
     * 
     */
    this.newCalendar = $pluf.createNew({
	method : 'POST',
	url : '/api/calendar/calendars/new'
    }, _calendarCache);

    /**
     * Gets calendar detail by secure id
     * 
     * @memberof $calendar
     * @return Promise<PCalendar>
     * 
     */
    this.calendar = $pluf.createGet({
	method : 'GET',
	url : '/api/calendar/calendars/{id}',
    }, _calendarCache);

    /**
     * Lists all calendar
     * 
     * @memberof $calendar
     * @return Promise<PaginatorPage<PCalendar>>
     * 
     */
    this.calendars = $pluf.createFind({
	method : 'GET',
	url : '/api/calendar/calendars/find',
    }, _calendarCache);

    /**
     * Creates new event
     * 
     * @memberof $calendar
     * @return Promise<PEvent> created gate
     */
    this.newEvent = $pluf.createNew({
	method : 'POST',
	url : '/api/calendar/events/new'
    }, _eventCache);
    

    /**
     * Gets event detail by secure id
     * 
     * @memberof $calendar
     * @return Promise<PEvent>
     * 
     */
    this.event = $pluf.createGet({
	method : 'GET',
	url : '/api/calendar/events/{id}',
    }, _eventCache);

    /**
     * Lists all events
     * 
     * @memberof $calendar
     * @return Promise<PaginatorPage<PEvent>>
     * 
     */
    this.events = $pluf.createFind({
	method : 'GET',
	url : '/api/calendar/events/find',
    }, _eventCache);

});