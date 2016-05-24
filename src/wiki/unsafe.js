/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	angular
	.module('pluf.wiki')
	.filter('unsafe', [
       '$sce', unsafe
    ]);

	/**
	 * فیلتر نمایش صفحه‌ها را ایجاد می‌کند.
	 */
	function unsafe($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	}

})();
