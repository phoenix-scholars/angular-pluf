/*******************************************************************************
 * $PObject
 * =============================================================================
 * ساختار داده‌ای نرم‌افزار را ایجاد می‌کند.
 ******************************************************************************/
.factory('PaginatorPage', function(PObject) {
	var paginatorPage = function() {
		PObject.apply(this, arguments);
	};
	paginatorPage.prototype = new PObject();
	return paginatorPage;
});