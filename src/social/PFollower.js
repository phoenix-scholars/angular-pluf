/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @ngdoc factory
 * @name PFollower
 * @memberof pluf.social
 * @description
 *
 * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
 */
	.factory('PFollower',	function(PObject) {

	var pFollower = function() {
		PObject.apply(this, arguments);
	};

	pFollower.prototype = new PObject();

	return pFollower;
});
