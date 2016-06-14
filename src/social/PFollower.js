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
	 * @ngdoc factory
	 * @name PFollower
	 * @memberof pluf.social
	 * @description
	 * 
	 * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
	 */
	function PFollower(PObject, PException) {

		var pFollower = function() {
			PObject.apply(this, arguments);
		};

		pFollower.prototype = new PObject();

		return pFollower;
	}

})();
