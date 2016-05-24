(function(){
	
	angular
	.module('pluf.wiki')
	.service('$help', [
       '$http', '$httpParamSerializerJQLike', '$q', 
       'PException', 'PWikiPage', 'PWikiBook', 'PaginatorPage',
       help
	]);
				
	
	/**
	 * @ngdoc service
	 * @name $help
	 * @memberof wiki
	 * 
	 * @description
	 * این سرویس امکانات مدیریت صفحه‌ها و کتاب‌های ویکی را فراهم می‌کند. با استفاده از این سرویس
	 * می‌توان صفحات و کتاب‌های ویکی را ایجاد، حذف، جستجو و یا دریافت کرد.
	 */
	function help($http, $httpParamSerializerJQLike, $q, PException, PWikiPage,
			PWikiBook, PaginatorPage) {
		/*
		 * کار با صفحه‌ها
		 */
		/** @private */
		this._ppage = {}
		/** @private */
		this._getPage = function(id) {
			return this._ppage[id];
		}
		/** @private */
		this._setPage = function(page) {
			this._ppage[page.id] = page;
		}
		/** @private */
		this._retPage = function(id, data) {
			var instance = this._getPage(id);
			if (instance) {
				instance.setData(data);
			} else {
				instance = new PWikiPage(data);
				this._setPage(instance);
			}
			return instance;
		}

		/*
		 * کار با کتابها
		 */
		/** @private */
		this._pbook = {}
		/** @private */
		this._getBook = function(id) {
			return this._pbook[id];
		}
		/** @private */
		this._setBook = function(page) {
			this._pbook[page.id] = page;
		}
		/** @private */
		this._retBook = function(id, data) {
			var instance = this._getBook(id);
			if (instance) {
				instance.setData(data);
			} else {
				instance = new PWikiBook(data);
				this._setBook(instance);
			}
			return instance;
		}

		/* فراخوانی‌های عمومی */
		/**
		 * کتاب‌های ویکی را با توجه به پارامتر p مورد جستجو قرار می‌دهد و نتیجه را در قالب
		 * یک فهرست صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
		 * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
		 * 
		 * @memberof $help
		 * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
		 * @return {promise(PaginatorPage<PWikiBook>)} ساختاری صفحه‌بندی شده از کتاب‌ها در نتیجه جستجو
		 */
		this.books = function(p) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/wiki/book/find',
				params: p.getParameter(),
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				var items = [];
				for (var i = 0; i < page.counts; i++) {
					var t = scope._retBook(page.items[i].id, page.items[i]);
					items.push(t);
				}
				page.items = items;
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}

		/**
		 * کتاب با شناسه داده شده را برمی گرداند.
		 * 
		 * @memberof $help
		 * @param {Integer} id شناسه کتاب مورد نظر
		 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب با شناسه داده شده
		 */
		this.book = function(id) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/wiki/book/' + id,
			}).then(function(res) {
				var book = scope._retBook(res.data.id, res.data);
				return book;
			}, function(data) {
				throw new PException(data);
			});
		}

		/**
		 * یک کتاب را بر اساس اطلاعات داده شده ایجاد می‌کند و کتاب ایجاد شده را
		 * به صورت غیرهمزمان برمی‌گرداند.
		 * 
		 * @memberof $help
		 * @param {PWikiBook} b کتابی که باید ذخیره شود
		 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب پس از ذخیره شدن
		 */
		this.createBook = function(b) {
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/wiki/book/create',
				data: $httpParamSerializerJQLike(b),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				var t = scope._retBook(res.data.id, res.data);
				return t;
			}, function(data) {
				throw new PException(data);
			});
		}

		/**
		 * صفحات ویکی را با توجه به پارامتر p مورد جستجو قرار داده و صفحات نتیجه را 
		 * در قالب یک ساختار صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
		 * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
		 * 
		 * @memberof $help
		 * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
		 * @return {promise(PaginatorPage<PWikiPage>)} ساختاری صفحه‌بندی شده از صفحات در نتیجه جستجو
		 */
		this.pages = function(p) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/wiki/page/find',
				params: p.getParameter(),
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				var items = [];
				for (var i = 0; i < page.counts; i++) {
					var t = scope._retPage(page.items[i].id, page.items[i]);
					items.push(t);
				}
				page.items = items;
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}

		/**
		 * صفحه با شناسه داده شده را برمی گرداند.
		 * 
		 * @memberof $help
		 * @param {Integer} id شناسه صفحه مورد نظر
		 * @return {promise(PWikiPage)} ساختاری حاوی اطلاعات صفحه با شناسه داده شده
		 */
		this.page = function(id) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/wiki/page/' + id,
			}).then(function(res) {
				var page = scope._retPage(res.data.id, res.data);
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}

		/**
		 * یک صفحه را بر اساس اطلاعات داده شده ایجاد می‌کند و صفحه ایجاد شده را
		 * به صورت غیرهمزمان برمی‌گرداند.
		 * 
		 * @memberof $help
		 * @param {PWikiPage} b صفحه‌ای که باید ذخیره شود
		 * @return {PWikiPage} ساختاری حاوی اطلاعات صفحه پس از ذخیره شدن
		 */
		this.createPage = function(p) {
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/wiki/page/create',
				data: $httpParamSerializerJQLike(p),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				var t = scope._retPage(res.data.id, res.data);
				return t;
			}, function(data) {
				throw new PException(data);
			});
		}

	}
	
	
})();