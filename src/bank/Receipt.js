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
.factory('PReceipt', function(PObject) {

	/*
	 * Creates new instance
	 */
	var pReceipt = function() {
		PObject.apply(this, arguments);
	};
	// Extends it from PObject
	pReceipt.prototype = new PObject();

	pReceipt.prototype.update = function() {

	};

	pReceipt.prototype.remove = function() {

	};
	return pReceipt;
});