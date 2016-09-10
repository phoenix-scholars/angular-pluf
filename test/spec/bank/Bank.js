/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Core module test: PProfile', function() {
	var PBank;
	beforeEach(function() {
		module('pluf');
		inject(function(_PBank_) {
			PBank = _PBank_;
		});
	});

	// check to see if it has the expected function
	it('Check PBank API', function() {
		var bank = new PBank();
		expect(angular.isFunction(bank.update)).toBe(true);
		expect(angular.isFunction(bank.remove)).toBe(true);
	});

});
