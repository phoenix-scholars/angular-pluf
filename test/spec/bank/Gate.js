/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Bank module test: PGate', function() {
	var PGate;
	beforeEach(function() {
		module('pluf');
		inject(function(_PGate_) {
			PGate = _PGate_;
		});
	});

	// check to see if it has the expected function
	it('Check PGate API', function() {
		var gate = new PGate();
		expect(angular.isFunction(gate.update)).toBe(true);
		expect(angular.isFunction(gate.remove)).toBe(true);
	});
});
