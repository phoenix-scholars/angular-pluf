/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	angular
	.module('pluf.wiki')
	.factory('PWikiBook', [
		'PObject', 'PException', 'PWikiPageItem', 'PaginatorPage', '$http', '$q', '$timeout',
		PWikiBook
	]);

	/**
	 * @ngdoc factory
	 * @name PWikiBook
	 * @memberof wiki
	 *
	 * @description
	 * ساختار داده‌ای یک کتاب به همراه اطلاعات کامل صفحه.
	 *
	 * @attr {Integer} id شناسه کتاب
	 * @attr {String} title عنوان کتاب
	 * @attr {String} state وضعیت کتاب
	 * @attr {String} language زبان مورد استفاده در متن صفحات کتاب
	 * @attr {String} summary خلاصه یا توضیحی کوتاه در مورد کتاب
	 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد کتاب
	 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
	 */
	function PWikiBook(PObject, PException, PWikiPageItem, PaginatorPage, $http, $q, $timeout) {

		var pWikiBook = function() {
			PObject.apply(this, arguments);
		};

		pWikiBook.prototype = new PObject();

		/**
		 * صفحه با شناسه داده شده را از فهرست صفحات کتاب بازیابی می‌کند.
		 *
		 * @private
		 * @memberof PWikiBook
		 * @param id شناسه صفحه
		 * @param data داده‌های صفحه
		 * @returns {PWikiPageItem}
		 */
		pWikiBook.prototype._retItem = function(id, data) {
			var item = null;
			for ( var i in this.items) {
				if (this.items[i].id == id) {
					item = this.items[i];
					break;
				}
			}
			if (!item) {
				item = new PWikiPageItem(data);
				this.items.push(item);
			}
			item.setData(data);
			return item;
		};

		/**
		 * اولین صفحه کتاب را برمی‌گرداند
		 *
		 * @memberof PWikiBook
		 * @returns {promise(PWikiPageItem)} یک PageItem مربوط به صفحه اول کتاب
		 */
		pWikiBook.prototype.firstPage = function() {
			var def = $q.defer();
			var scope = this;
			$timeout(function() {
				def.resolve(scope.items[0]);
			}, 1);
			return def.promise;
		};

		/**
		 * فهرستی از صفحات کتاب را برمی‌گرداند
		 *
		 * @memberof PWikiBook
		 * @returns {promise(PaginatedPage<PWikiPageItem>)}
		 *  فهرستی صفحه بندی شده از PageItem های مربوط به صفحات کتاب
		 */
		pWikiBook.prototype.pages = function() {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/wiki/book/' + scope.id + '/pages',
			}).then(function(res) {
				scope.items = [];
				for (var i = 0; i < res.data.length; i++) {
					scope._retItem(res.data[i].id, res.data[i]);
				}
				return scope.items;
			}, function(data) {
				throw new PException(data);
			});
		};
		/**
		 * یک صفحه را به کتاب اضافه می‌کند
		 *
		 * @memberof PWikiBook
		 * @param {PWikiPage} page صفحه‌ای که به کتاب اضافه خواهد شد
		 * @returns {promise(PWikiBook)} خود کتاب را که صفحه جدید به آن اضافه شده است برمی‌گرداند
		 */
		pWikiBook.prototype.addPage = function(page) {
			if(page.isAnonymous()){
				var dif = $q.defer();
				$timeout(function(){
					var ex = new PException({message:"Page id is null!"});
					dif.reject(ex);
				}, 1);
				return dif.promise;
			}
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/wiki/book/' + scope.id + '/page/' + page.id,
			}).then(function(res) {
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		};

		/**
		 * یک صفحه را از کتاب حذف می‌کند
		 *
		 * @memberof PWikiBook
		 * @param {PWikiPage} page صفحه‌ای که باید از کتاب حذف شود
		 * @returns {promise(PWikiPage)} صفحه حذف شده از کتاب را برمی‌گرداند
		 */
		pWikiBook.prototype.removePage = function(page) {
			if(page.isAnonymous()){
				var dif = $q.defer();
				$timeout(function(){
					var ex = new PException({message:"Page id is null!"});
					dif.reject(ex);
				}, 1);
				return dif.promise;
			}
			var scope = this;
			return $http({
				method: 'DELETE',
				url: '/api/wiki/book/' + scope.id + '/page/' + page.id,
			}).then(function(res) {
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		};

		/**
		 * اطلاعات یک کتاب را به‌روزرسانی می‌کند.
		 *
		 * @memberof PWikiBook
		 * @param {struct} b ساختاری حاوی اطلاعاتی از کتاب که باید به‌روزرسانی شود
		 * @returns {promise(PWikiBook)} کتاب با اطلاعات به‌روزرسانی شده
		 */
		pWikiBook.prototype.update = function(b) {
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/wiki/book/' + scope.id,
				data: $httpParamSerializerJQLike(b),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				scope.setData(res.data);
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		};

		/**
		 * کتاب را حذف می‌کند
		 *
		 * @memberof PWikiBook
		 * @returns {promise(PWikiBook)} کتاب حذف شده
		 */
		pWikiBook.prototype.remove = function() {
			var scope = this;
			return $http({
				method: 'DELETE',
				url: '/api/wiki/book/' + scope.id
			}).then(function(res) {
				scope.setData(res.data);
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		};

		return pWikiBook;
	}


})();
