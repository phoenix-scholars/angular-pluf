(function(){
	
	angular
	.module('wiki')
	.factory('PWikiPageItem', ['PObject', PWikiPageItem]);
	
	/**
	 * @ngdoc factory
	 * @name PWikiPageItem
	 * @memberof wiki
	 * 
	 * @description
	 * ساختار داده‌ای یک آیتم از نوع صفحه با کمترین اطلاعات ممکن.
	 * 
	 * @attr {Integer} id شناسه PageItem
	 * 
	 * @attr {Integer} priority
	 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
	 * 
	 * @attr {String} title عنوان صفحه
	 * @attr {String} state وضعیت صفحه
	 * 
	 */
	function PWikiPageItem(PObject) {

		var wikiPageItem = function(d) {
			if (d) {
				this.setData(d);
			}
		}

		wikiPageItem.prototype = new PObject();

		/**
		 * صفحه مربوط به این PageItem را برمی گرداند
		 * 
		 * @memberof PWikiPageItem
		 * @returns {promise(PWikiPage)} صفحه مربوط به این PageItem 
		 */
		wikiPageItem.prototype.page = function() {
			// TODO: پیاده‌سازی شود
		}

		return wikiPageItem;
	}
	
})();