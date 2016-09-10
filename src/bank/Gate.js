/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $act
 * @description
 * 
 * 
 */
.factory('PGate', function(PObject) {

	/*
	 * Creates new instance
	 */
	var pGate = function() {
		PObject.apply(this, arguments);
	};
	// Extends it from PObject
	pGate.prototype = new PObject();

	pGate.prototype.update = function() {

	};

	pGate.prototype.remove = function() {

	};
	return pGate;
});