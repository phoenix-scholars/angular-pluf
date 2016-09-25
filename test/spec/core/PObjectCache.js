/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Core module: PObjectCache', function() {
	var PObjectCache;
	var PObject;

	beforeEach(function() {
		module('pluf');
		inject(function(_PObjectCache_, _PObject_) {
			PObjectCache = _PObjectCache_;
			PObject = _PObject_;
		});
	});

	// check to see if it has the expected function
	it('should define restore', function() {
		var cache = new PObjectCache(function(data) {
			return new PObject(data);
		});
		expect(angular.isFunction(cache.restor)).toBe(true);
	});

	it('create new object', function(done) {
		var id = 12;
		var cache = new PObjectCache(function(data) {
			expect(data.id).toBe(id);
			done();
			return new PObject(data);
		});
		cache.restor(id, {
			id : id,
			title : 'example'
		});
	});
});
