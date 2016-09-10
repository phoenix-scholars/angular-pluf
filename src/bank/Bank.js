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
.factory('PBank', function(PObject) {
	
	/*
	 * Creates new instance
	 */
	var pBank = function() {
		PObject.apply(this, arguments);
	};
	// Extends it from PObject
	pBank.prototype = new PObject();
	
	/**
	 * Updates bank 
	 */
	pBank.prototype.update = function() {

	};
	
	/**
	 * remove bank
	 */
	pBank.prototype.remove = function() {

	};
	return pBank;
});