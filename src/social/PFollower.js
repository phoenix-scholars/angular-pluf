/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	angular
	.module('pluf.social')
	.factory('PFollower', [
		'PObject', 'PException', PFollower
	]);

	/**
	 * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
	 */
	function PFollower(PObject, PException) {

		pFollower.prototype = new PObject();

		var pFollower = function() {
			PObject.apply(this, arguments);
		};

		return pFollower;
	}

})();
