/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Bank module test: PReceipt', function() {
	var PReceipt;
	beforeEach(function() {
		module('pluf');
		inject(function(_PReceipt_) {
			PReceipt = _PReceipt_;
		});
	});

	// check to see if it has the expected function
	it('Check Receipt API', function() {
		var receipt = new PReceipt();
		expect(angular.isFunction(receipt.update)).toBe(true);
		expect(angular.isFunction(receipt.remove)).toBe(true);
	});
});
