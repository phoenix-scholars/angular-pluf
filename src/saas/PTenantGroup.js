/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenantGroup
 * @description
 * تنظیم‌های یک ملک را تعیین می‌کند.
 *
 */
.factory('PTenantGroup', function($http, $q, $window, PObject) {
	var pTenantGroup = function() {
		PObject.apply(this, arguments);
	};
	pTenantGroup.prototype = new PObject();
	return pTenantGroup;
});
