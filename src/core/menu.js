/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$menu',['$q', '$timeout', 'PMenu', 'PMenuItem', menu]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $menu
	 * @description
	 * معمولا توی برنامه‌های گرافیکی نیاز دارید دسته‌ای از عمل‌های و دستورها را به صورت یک منو نمایش
	 * بدید. برای نمونه نوار ابزاری که بالای یک صفحه میاد یک نمونه از منوهایی است که توی نرم افزارها
	 * استفاده می‌شه. یا اینکه منوهای کشویی که از سمت راست و یا چپ صفحه نمایش داده می‌شن هم
	 * از این نمونه‌ها هستن.
	 *
	 * بدترین راه حل این هست که هرجا لازم داشتیم یک فهرست از عمل‌ها رو ایجاد کنیم و توی نمایش قرار
	 * بدیم اما این کار مشکل‌هایی  اساسی داره که عبارتند از:
	 *
	 * - کدهایی با یک کارکرد توی سیستم تکرار می‌شن و مدیریتش مشکل می‌شه
	 * - لایه نمایش پیچیده می‌شه
	 * - تست عمل‌های اضافه شده مشکل می‌شه
	 *
	 * نمی‌خوام بگم که بهترین راه حل اینکه بیایم تمام عمل‌ها بزاریم توی یه لیست و این لیست رو هرجایی
	 * استفاده کنیم. ولی حداقل این هست که می‌تونیم کارهای پر کاربرد رو به صورت متمرکز تعریف کنیم و
	 * از هرجایی استفاده کنیم. توی سیستم مثل اکلیپس از این تکنیک استفاده شده و ما هم اینجا استفاده
	 * کردیم.
	 *
	 * روال کلی این هست که دسته‌ای از دستورها و عمل‌های دلخواه رو با یک کلید به عنوان منو ذخیره
	 * می‌کنید و هرجایی که لازم داشتید این منو رو نمایش میدید. یکی از مهم‌ترین کارهایی که می‌تونید
	 * استفاده کنید دستورهایی مثل ورود و خروج کاربر هست.
	 *
	 * با این کار هر کنترولی از سیستم می‌تونه یه سری دستور جدید به منو اضافه کن و با بزرگ شدن نرم افزار
	 * این منو هم به صورت خودکار رشد خواهد کرد. نکته اینکه دستورها رو تو خود کنترولها اضافه نکنید مخصوصا
	 * زمانی که از مدلهای ng-route استفاده می‌کنید.
	 *
	 * @example
	 * // Create header menu in app
	 * angular.module('myApp')
	 * 	.run(function($menu){
	 * 		$menu.addItem('header', {
	 * 			command: 'usr.login'
	 * 		}).addItem('header', {
	 * 			command: 'logout'
	 * 		});
	 * 	});
	 *
	 * @example
	 * // Assigne header menu into scope variable
	 * angular.module('myApp').controller('SidebarController', function($scope, $menu){
	 * 	$menu.menu('header').then(function(menu){
	 * 		$scope.menu = menu;
	 * 	})
	 * });
	 *
	 * @example
	 * <!-- Show all action in menu -->
	 * <ul>
	 * 	<li ng-repeat="m in menu.items"
	 * 			ng-show="m.visible">{{m.label}}</li>
	 * </ul>
	 */
	function menu($q, $timeout, PMenu, PMenuItem) {
		/**
		 * مخزنی از تمام منوها ایجاد می‌کند. این مخزن می‌تواند به صورت مستقیم در سایر نمایش‌ها و سرویس‌ها
		 * استفاده شود.
		 *
		 * @type {Array}
		 */
		this.menus = [];

		/*
		 * یک منوایتم رو به منوهای موجود اضافه می‌کند. در صورتی که منو معادل وجود نداشته باشد یک نمونه
		 * جدید برای آن ایجاد خواهد کردم.
		 */
		this._addMenu = function(id, menu) {
			if (!(id in this.menus)) {
				this.menus[id] = new PMenu({'id': id});
			}
			this.menus[id].item(menu);
		};

		/**
		 * یک منو را با شناسه تعیین شده بازیابی می‌کند. در صورتی که منو با شناسه در مورد نظر موجود
		 * نباشد یک نمونه برای آن ایجاد شده و به عنوان نتیجه برگردانده می‌شود.
		 *
		 * @memberof $menu
		 * @param  {string} id شناسه منو مورد نظر
		 * @return {promise(PMenu)} منوی ایجاد شده
		 */
		this.menu = function(id) {
			var def = $q.defer();
			var scope = this;
			$timeout(function() {
				if (!(id in scope.menus)) {
					scope.menus[id] = new PMenu({'id':id});
				}
				def.resolve(scope.menus[id]);
			}, 1);
			return def.promise;
		};

		/**
		 * یک گزینه جدید به منو اضافه می‌کند. این روش اضافه کردن منو کلی است و همواره یک منوایتم
		 * به عنوان گزینه جدید اضافه خواهد شد.
		 *
		 * @memberof $menu
		 * @param {string} شناسه منو مورد نظر
		 * @param {object} داده‌های مورد نیاز برای ایجاد منوایتم
		 */
		this.addItem = function(id, menu) {
			this._addMenu(id, new PMenuItem(menu));
			return this;
		};
	}
// پایان
})();
