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
 * @name PInvoice
 * @description اطلاعات یک  فاکتور را تعیین می‌کند.
 * 
 * @attr {integer} id
 * @attr {string} name
 * 
 */
.factory('PInvoice', function($pluf, $injector, PObject, PReceipt, PObjectFactory) {

	var _receiptFactory = new PObjectFactory(function(data) {
		return new PReceipt(data);
    });
	
	var _invoiceFactory = new PObjectFactory(function(data) {
	    if(!this.pInvoiceInjector){
	    	this.pInvoiceInjector = $injector.get('PInvoice');
	    }
	    return new this.pInvoiceInjector(data);
	});
	
	var pInvoice = function() {
		PObject.apply(this, arguments);
	};
	pInvoice.prototype = new PObject();

//	/**
//	 * فاکتور را به روز رسانی می‌کنند.
//	 * 
//	 * @memberof PInvoice
//	 * @return {promise<PInvoice>} فاکتور به روز شده
//	 */
//	pInvoice.prototype.update = $pluf.createUpdate({
//		method : 'POST',
//		url : '/api/saas/invoice/:id',
//	});

//	/**
//	 * فاکتور را حذف می‌کند.
//	 * 
//	 * @return {PInvoice} فاکتور حذف شده
//	 */
//	pInvoice.prototype.delete = $pluf.createDelete({
//		method : 'DELETE',
//		url : '/api/spa/:id'
//	});


	pInvoice.prototype.pay = $pluf.createNew({
		method : 'POST',
		url : '/api/saas/invoice/:id/pay'
	}, _receiptFactory);
		
	pInvoice.prototype.state = $pluf.createGet({
		method : 'GET',
		url : '/api/saas/invoice/:id/state'
	}, _invoiceFactory);

	return pInvoice;
});
