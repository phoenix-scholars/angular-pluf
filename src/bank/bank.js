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
.service( '$bank', function($pluf, PBank, PGate, PReceipt, PObjectCache) {

    var _banksCache = new PObjectCache(function(data) {
	return new PBank(data);
    });

    var _gateCache = new PObjectCache(function(data) {
	return new PGate(data);
    });

    var _receiptCache = new PObjectCache(function(data) {
	return new PReceipt(data);
    });

    /**
     * Creates new receipt
     * 
     * @memberof $bank
     * @return Promise<PReceipt>
     * createdreceipt
     * 
     */
    this.newReceipt = $pluf.createNew({
	method : 'POST',
	url : '/api/bank/receipt/new'
    }, _receiptCache);

    /**
     * Gets receipt detail by secure id
     * 
     * @memberof $bank
     * @return Promise<PReceipt>
     * createdreceipt
     * 
     */
    this.receipt = $pluf.createGet({
	method : 'GET',
	url : '/api/bank/receipt/{id}',
    }, _receiptCache);

    /**
     * Lists all receipts
     * 
     * @memberof $bank
     * @return Promise<PaginatorPage<PReceipt>>
     * createdreceipt
     * 
     */
    this.receipts = $pluf.createFind({
	method : 'GET',
	url : '/api/bank/receipt/find',
    }, _receiptCache);

    /**
     * Creates new gate
     * 
     * @memberof $bank
     * @return Promise<PGate> created gate
     */
    this.newGate = $pluf.createNew({
	method : 'POST',
	url : '/api/bank/backend/new'
    }, _gateCache);
    
    /**
     * Gets list of required properties
     * 
     * The best way to get a bank property is:
     * <pre><code>
     * 	var bank;
     * 	...
     * 	$bank.getProperty(bank)//
     * 	.then(function(proeprty){
     * 		// TODO: deil with property
     * 	});
     * </code></pre>
     * 
     * In the other hand, the following type is correct too: 
     * <pre><code>
     * 	var bank;
     * 	...
     * 	$bank.getProperty({type: bank.type})//
     * 	.then(function(proeprty){
     * 		// TODO: deil with property
     * 	});
     * </code></pre>
     * 
     * @memberof $bank
     * @return Promise<Property>
     */
    this.gateProperty = $pluf.get({
	url : '/api/bank/backend/new'
    });

    /**
     * Gets a gate
     * 
     * @memberof $bank
     * @return Promise<PGate> a gate
     */
    this.gate = $pluf.createGet({
	method : 'GET',
	url : '/api/bank/backend/{id}',
    }, _gateCache);

    /**
     * Lists all gates
     * 
     * @memberof $bank
     * @param paginatorParam
     * @return Promise<PaginatorPage<PGate>> gates list
     */
    this.gates = $pluf.createFind({
	method : 'GET',
	url : '/api/bank/backend/find',
    }, _gateCache);

    /**
     * Gets bank detail
     * 
     * @memberof $bank
     * @return Promise<PBank>
     */
    this.bank = $pluf.createGet({
	method : 'GET',
	url : '/api/bank/engine/{id}',
    }, _banksCache);

    /**
     * Gets bank list
     * 
     * 
     * @memberof $bank
     * @return Promise<PaginatorPage<PGate>> gates list
     */
    this.banks = $pluf.createFind({
	method : 'GET',
	url : '/api/bank/engine/find',
    }, _banksCache);
});