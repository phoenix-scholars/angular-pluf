/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PPreferenceNode',[
			'PObject',
			PPreferenceNode
		]);

		/**
		 * @memberof pluf
		 * @ngdoc factory
		 * @name PPreferenceNode
		 * @description
		 *
		 * یک تنظیم در سیستم را تعیین می‌کند. سیستم تنظیم‌ها به صورت یک درخت در نظر گرفته می‌شود
		 * که در آن هر گره معادل با یک تنظیم در سیستم است. این سیستم برای ایجاد تنظیم‌های کاربری
		 * در نمایش به کار گرفته می‌شود. برای نمونه زبان برنامه، لایه بندی آن و یا تم مورد استفاده از
		 * مواردی است که در این تنظیم‌ها قرار می‌گیرد.
		 *
		 * این تنظیم‌ها سمت کاربر نگهداری می‌شود و برنامه کاربری می‌تواند آنها را برای اجرای بعدی نگهداری
		 * کند.
		 */
		function PPreferenceNode(PObject) {
			var pPreferenceNode = function() {
				PObject.apply(this, arguments);
			};
			pPreferenceNode.prototype = new PObject();
			/**
			 * یک بخش دجدید در تنظیم‌ها ایجاد می‌کند.
			 *
			 * بخش در حقیقت یک گره نامدار است که کاربران می‌توانند با استفاده از فراخوانی‌های در نظر
			 * گرفته شده به آن دسترسی داشته باشند.
			 * @memberof PPreferenceNode
			 * @param  {String} n نام گره جدید در تنظیم‌ها
			 * @return {promise(PPreferenceNode)} قول برای ایجاد گره جدید
			 */
			pPreferenceNode.prototype.newNode = function(n) {
				var def = $q.defer();
				var scope = this;
				$timeout(function() {
					var node = new pPreferenceNode();
					scope.children[n] = section;
					def.resolve(node);
					//XXX: maso, 1395: ذخیره کرده تنظیم‌های جدید
				}, 1);
				return def.promise;
			};
			/**
			 * گره تعیین شده با نام را پیدا کرده و به عنوان نتیجه برمی‌گرداند
			 * @memberof PPreferenceNode
			 * @param  {String} n نام گره مورد نظر
			 * @return {PaginatorPage(PPreferenceNode)}  زیرگره معادل
			 */
			pPreferenceNode.prototype.node = function(n) {
				//XXX: maso, 1395: از بین بچه‌ها گره مناسب را پیدا کرده و به عنو نتیجه برمی‌گرداند
			};
			/**
			 * تمام زیر گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد.
			 * @memberof PPreferenceNode
			 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
			 * @return {promise(PaginatorPage)}   گره‌ها به صورت صفحه بندی شده.
			 */
			pPreferenceNode.prototype.nodes = function(p) {
				//XXX: maso, 1395:
			};
			/**
			 * گره پدر را تعیین می‌کند.
			 * @memberof PPreferenceNode
			 * @return {promise(PPreferenceNode)} یک دستگیره برای انجام کار
			 */
			pPreferenceNode.prototype.parent = function() {
				//XXX: maso, 1395:
			};
			return pPreferenceNode;
		}


//End
})();
