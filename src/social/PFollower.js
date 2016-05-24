(function(){
	
	angular
	.module('social')
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