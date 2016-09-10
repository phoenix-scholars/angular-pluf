/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Bank module test: $bank', function() {
	var $bank;

	beforeEach(function() {
		module('pluf');
	});

	beforeEach(function() {
		inject(function(_$bank_) {
			$bank = _$bank_;
		});
	});

	it('Check $bank API', function() {
		// receipt functions
		expect(angular.isFunction($bank.receipt)).toBe(true);
		expect(angular.isFunction($bank.receiptById)).toBe(true);
		expect(angular.isFunction($bank.createReceipt)).toBe(true);
		expect(angular.isFunction($bank.receipts)).toBe(true);

		// gate api
		expect(angular.isFunction($bank.createGate)).toBe(true);
		expect(angular.isFunction($bank.gate)).toBe(true);
		expect(angular.isFunction($bank.gates)).toBe(true);

		// bank api
		expect(angular.isFunction($bank.bank)).toBe(true);
		expect(angular.isFunction($bank.banks)).toBe(true);
	});
});
