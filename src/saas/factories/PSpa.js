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
 * @memberof pluf.saas
 * @name PSpa
 * @description اطلاعات یک نرم افزار را تعیین می‌کند.
 * 
 * @attr {integer} id
 * @attr {string} name
 * 
 */
.factory('PSpa', function($pluf, $window, PObject) {

    var pSpa = function() {
	PObject.apply(this, arguments);
    };
    pSpa.prototype = new PObject();

    /**
     * نرم افزار را به روز رسانی می‌کنند.
     * 
     * @memberof PSpa
     * @return {promise<PSpa>} نرم افزار به روز شده
     */
    pSpa.prototype.update = $pluf.createUpdate({
	method : 'POST',
	url : '/api/spa/:id',
    });

    /**
     * نرم افزار را حذف می‌کند.
     * 
     * @return {PSpa} نرم افزار حذف شده
     */
    pSpa.prototype.delete = $pluf.createDelete({
	method : 'DELETE',
	url : '/api/spa/:id'
    });

    /**
     * اجرای نرم افزار.
     * 
     * @memberof PSpa
     * @param {Boolean} newTab تعیین می‌کنه که آیا نرم افزار توی یک برگه جدید باز بشه
     */
    pSpa.prototype.run = function(newTab) {
	var location = $window.location.origin + '/' + this.name + '/';
	if(newTab){
	    $window.open(location, '_blank');
	} else {
	    $window.location = location;
	}
    };

    return pSpa;
});
