/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
 * بعد از اینکه پرداخت در سیستم ایجاد شد کاربر می تونه برای پرداخت آن از درگاه تعیین 
 * شده اقدام کنه.
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
.service('$bank', function(/* $http, $q, PaginatorPage */) {
	/**
	 * Creates new receipt
	 * 
	 * @memberof $bank
	 * @return Promise<PReceipt> created receipt
	 */
	this.createReceipt = function() {

	};

	/**
	 * Gets receipt detail by secure id
	 * 
	 * @memberof $bank
	 * @return Promise<PReceipt> created receipt
	 */
	this.receipt = function() {

	};

	/**
	 * Gets receipt detail
	 * 
	 * @memberof $bank
	 * @return Promise<PReceipt> created receipt
	 */
	this.receiptById = function() {
		
	};

	/**
	 * Lists all receipts
	 * 
	 * @memberof $bank
	 * @return Promise<PaginatorPage<PReceipt>> created receipt
	 */
	this.receipts = function() {

	};

	/**
	 * Creates new gate
	 * 
	 * @memberof $bank
	 * @return Promise<PGate> created gate
	 */
	this.createGate = function() {

	};

	/**
	 * Gets a gate
	 * 
	 * @memberof $bank
	 * @return Promise<PGate> a gate
	 */
	this.gate = function() {

	};

	/**
	 * Lists all gates
	 * 
	 * @memberof $bank
	 * @return Promise<PaginatorPage<PGate>> gates list
	 */
	this.gates = function() {

	};

	/**
	 * Gets bank detail
	 * 
	 * @memberof $bank
	 * @return Promise<PBank> 
	 */
	this.bank = function() {

	};
	
	/**
	 * Gets bank list
	 * 
	 * 
	 * @memberof $bank
	 * @return Promise<PaginatorPage<PGate>> gates list
	 */
	this.banks = function() {

	};

});