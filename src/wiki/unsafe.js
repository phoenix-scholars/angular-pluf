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