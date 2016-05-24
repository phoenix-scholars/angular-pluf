/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	angular
	.module('pluf.saas')
	.factory('PApplicationDetail', [
		'$http', '$q', '$window', 'PObject', PApplicationDetail
    ]);

	/*******************************************************************************
	 * PApplication
	 * =============================================================================
	 * هر نسخه می‌تواند از یک نوع نرم افزار خاص نصب شده استفاده کند. البته نرم
	 * افزارها باید تنها از خدمات ارائه شده در نسخه نصبی استفاده کنند. هر نرم افزار
	 * می‌تواند شامل تنظیم‌های متفاتی باشد.
	 ******************************************************************************/
	function PApplicationDetail($http, $q, $window, PObject) {
		var pApplicationDetail = function() {
			PObject.apply(this, arguments);
		};
		pApplicationDetail.prototype = new PObject();
		return pApplicationDetail;
	}

})();
