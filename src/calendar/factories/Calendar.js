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
 * @memberof $calendar
 * @ngdoc Facotyr
 * @name PEvent
 * @description
 * 
 * 
 */
.factory('PCalendar', function(PObject, $pluf, PObjectFactory) {
    
    // Object factory
    var _eventCache = new PObjectFactory(function(data) {
	if (!this.PEvent) {
	    this.PEvent = $injector.get('PEvent');
	}
	return new this.PEvent(data);
    });
    
    /*
     * Creates new instance
     */
    var pCalendar = function() {
	PObject.apply(this, arguments);
    };
    // Extends it from PObject
    pCalendar.prototype = new PObject();

    /**
     * Updates bank
     */
    pCalendar.prototype.update = $pluf.createUpdate({
	method : 'POST',
	url : '/api/calendar/calendars/:id'
    });

    /**
     * remove bank
     */
    pCalendar.prototype.remove = $pluf.createDelete({
	method: 'DELETE',
	url : '/api/calendar/calendars/:id',
    });
    pCalendar.prototype.delete = pCalendar.prototype.remove;
    
    /**
     * Fetchs event list
     * 
     * @param {PaginationParameter}
     * @return {Promise<PaginatedPage<PEvent>>}
     */
    pCalendar.prototype.events = $pluf.createGet({
	method : 'GET',
	url : '/api/calendars/calendar/:id/events/find',
    }, _eventCache);

    /**
     * Creates new event
     *
     * @param {PEvent data}
     * @return {Promise<PEvent>}
     */
    pCalendar.prototype.newGroup = $pluf.createNew({
	method : 'POST',
	url : '/api/calendars/calendar/:id/events/new'
    }, _eventCache);
    //
    return pCalendar;
});