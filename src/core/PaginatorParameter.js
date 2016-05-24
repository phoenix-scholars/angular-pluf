/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PaginatorParameter',[
			PaginatorParameter
		]);
	/*******************************************************************************
	 *                                صفحه بندی
	 * =============================================================================
	 * بسیاری از داده‌هایی که در سیستم موجود است به صورت صفحه بندی شده در اختیار کاربران قرار
	 * می‌گیرد. در این بخش ابزارهایی برای کار با صفحه بندی ارائه شده است.
	 ******************************************************************************/
	/**
	 * از جمله خصوصیاتی که می‌توان در این ساختار قرار داد عبارتند از:
	 * <ul>
	 * 	<li>_px_q</li> متن مورد جستجو در فیلدهای مختلف
	 * 	<li>_px_p</li> شماره صفحه مورد نظر از فهرست صفحه‌بندی شده
	 * 	<li>_px_ps</li> تعداد آیتم‌های موجود در هر صفحه
	 * 	<li>_px_fk</li> نام خصوصیتی که برای فیلتر کردن مورد استفاده قرار می‌گیرد
	 * 	<li>_px_fv</li> مقداری مورد نظر برای خصوصیتی که بر اساس آن فیلتر انجام می‌شود.
	 * 	<li>_px_sk</li> نام خصوصیتی که فهرست باید بر اساس آن مرتب شود.
	 * 	<li>_px_so</li> ترتیب مرتب‌سازی، اینکه مرتب‌سازی به صورت صعودی باشد یا نزولی
	 * </ul>
	 */
	function PaginatorParameter() {
		var pagParam = function(paginatorParam) {
			if (paginatorParam) {
				this.setData(paginatorParam);
			} else {
				this.setData({});
			}
		};
		pagParam.prototype = {
			param : {},
			setData : function(paginatorParam) {
				// angular.extend(this.param, paginatorParam);
				this.param = paginatorParam;
			},
			setSize : function($size) {
				this.param._px_c = $size;
				return this;
			},
			setQuery : function($query) {
				this.param._px_q = $query;
				return this;
			},
			/**
			 * تعیین صفحه مورد نظر
			 *
			 * این فراخوانی صفحه‌ای را تعیین می‌کند که مورد نظر کاربر است. برای نمونه اگر صفحه دوم از
			 * یک کاوش مد نظر باشد باید مقدار یک به عنوان ورودی این تابع استفاده شود.
			 *
			 * اندیس تمام صفحه‌ها از صفر شروع می‌شود. بنابر این صفحه اول اندیس صفر و صفحه دوم
			 * اندیس یک دارد.
			 *
			 * @param  int $page شماره صفحه
			 * @return PaginatorParameter    خود شئی به عنوان خروجی برگردانده می‌شود.
			 */
			setPage : function($page) {
				this.param._px_p = $page;
				return this;
			},
			setOrder : function($key, $order) {
				this.param._px_sk = $key;
				this.param._px_so = $order;
				return this;
			},
			setFilter : function($key, $value) {
				this.param._px_fk = $key;
				this.param._px_fv = $value;
				return this;
			},
			getParameter : function() {
				return this.param;
			}
		};
		return pagParam;
	}

// پایان
})();
