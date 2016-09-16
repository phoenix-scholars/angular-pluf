/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenantSetting
 * @description
 * تنظیم‌های یک ملک را تعیین می‌کند.
 *
 */
.factory('PTenantSetting',
function($http, $q, $window, PObject) {
	var pTenantSetting = function() {
		PObject.apply(this, arguments);
	};
	pTenantSetting.prototype = new PObject();
	return pTenantSetting;
});
