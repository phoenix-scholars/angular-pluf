/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$cms',[
			'$http', '$httpParamSerializerJQLike', '$q', '$timeout', 'PContent',	'PNamedContent', 'PaginatorPage', 'PException',
			cms
		]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $cms
	 * @description
	 *
	 * مهم‌ترین سرویسی است که در این بسته ارائه شده و کار با محتوی و اطلاعات آن را آسان می‌کند.
	 * این سرویس برای جستجو و یا گرفتن اطلاعات هر محتوایی از سیستم کاربرد دارد. متحوی کاربرد زیادی
	 * توی صفحه‌های وب داره مثلا با استفاده از محتوی می‌تونید صفحه اول سایت رو طراحی کنید و یا یک
	 * کلیپ آموزشی روی سایت بزارید.
	 *
	 * برای هر محتوی می‌تونید یک نام در نظر بگیرد که در این صورت بهش می‌گیم محتوی نام دارد. این
	 * نوع محتوی برای استفاده در سایت‌ها خیلی مناسب هست. برای نمونه در یک صفحه می‌تونید مطالب
	 * رو به صورت زیر بگیرد و نمایش بدید:
	 *
	 * <pre><code>
	 * 	$cms.namedContent('about-us').then(function(nc){
	 * 		return nc.value();
	 * 	}).then(function(cv){
	 * 		$scope.content = cv;
	 * 	});
	 * </code></pre>
	 *
	 * البته ما اینجا فرض کردیم که محتوی موجود از نوع جیسون هست برای همین به صورت یک موجودیت
	 * جاواسکریپتی باهاش برخورد کردیم.
	 */
	function cms($http, $httpParamSerializerJQLike, $q, $timeout,	PContent, PNamedContent, PaginatorPage, PException) {
		/*
		 * مخزن محتوی نامدار
		 */
		this._nc = {};
		/*
		 * گرفتن یک محتوی
		 */
		this._getnc = function(id){
			return this._nc[id];
		};
		/*
		 * بازیابی یک محتوی نامدار
		 */
		this._retnc = function(id, d) {
			var i = this._nc[id];
			if (i) {
				i.setData(d);
			} else {
				i = new PNamedContent(d);
				this._nc[id] = i;
			}
			return i;
		};
		/*
		 * مخزن محتوی
		 */
		this._c ={};
		/*
		 * گرفتن یک محتوی
		 */
		this._getc = function(id){
			return this._c[id];
		};
		/*
		 * بازیابی یک محتوی
		 */
		this._retc = function(id, c){
			var i = this._c[id];
			if (i) {
				i.setData(c);
			} else {
				i = new PContent(c);
				this._c[c.id] = i;
			}
			return i;
		};

		/**
		 * این فراخوانی یک ساختار داده‌ای جدید ایجاد می‌کند.
		 *
		 * @memberof $cms
		 * @param {PContent} contet ساختار داده‌ای محتوی برای ایجاد
		 * @return {promise(PContent)}
		 */
		this.newContent = function(c){
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/saascms/content/new',
				data : $httpParamSerializerJQLike(c),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).then(function(res){
				return scope._retc(res.data.id, res.data);
			});
		};

		/**
		 * یک محتوی با شناسه خاص را تعیین می‌کند.
		 *
		 * @memberof $cms
		 * @param  {Integer} id شناسه محتوی
		 * @return {promise(PContent)}   محتوی معادل
		 */
		this.content = function(i){
			var t = this._getc(i);
			if(t){
				var deferred = $q.defer();
				deferred.resolve(t);
				return deferred.promise;
			}
			t = this;
			return $http({
				method : 'GET',
				url : '/api/saascms/content/'+i,
			}).then(function(res){
				return t._retc(i, res.data);
			});
		};

		/**
		 * فهرست تمام محتوی موجود را تعیین می‌کند
		 *
		 * @memberof $cms
		 * @param  {PaginatorParameter} param پارامترهای جستجو
		 * @return {promise(PaginatorPage(PContent))}  نتیجه جستجو
		 */
		this.contents = function(p){
			var scope = this;
			return $http({
				method : 'GET',
				url : '/api/saascms/content/find',
				params : p.getParameter()
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				page.items = [];
				for (var i = 0; i < res.data.counts; i++) {
					var t = scope._retc(page.items[i].id, page.items[i]);
					page.items.push(t);
				}
				return page;
			}, function(data) {
				throw new PException(data);
			});
		};

		/**
		 * یک صفحه نامدار جدید ایجاد می‌کند.
		 *
		 * @memberof $cms
		 * @param  {string} name عنوان برای صفحه
		 * @param  {PContent} content محتوی مورد نظر
		 * @return {promise(PNamedContent)}   محتوی نام دار ایجاد شده
		 */
		this.newNamedContent = function(n, c){
			var scope = this;
			var nc;
			return $http({
				method: 'POST',
				url: '/api/saascms/page/new',
				data: $httpParamSerializerJQLike({
					content: c.id,
					name: n
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).then(function(res){
				nc = scope._retnc(res.data.name, res.data);
				return scope.content(nc.content);
			}).then(function(c){
				nc.content = c;
				return nc;
			});
		};

		/**
		 * گرفتن یک صفحه نامدار با استفاده از عنوان آن
		 *
		 * @memberof $cms
		 * @param  {string} name عنوان محتوی را تعیین می‌کند
		 * @return {promise(PNamedContent)}  محتوی معادل با نام
		 */
		this.namedContent = function(n){
			var t = this._getnc(n);
			if(t){
				var deferred = $q.defer();
				deferred.resolve(t);
				return deferred.promise;
			}
			var scope = this;
			var nc;
			return $http({
				method : 'GET',
				url : '/api/saascms/page/'+n,
			}).then(function(res){
				nc = scope._retnc(res.data.name, res.data);
				return scope.content(nc.content);
			}).then(function(c){
				nc.content = c;
				return nc;
			});
		};
		/**
		 * فهرست تمام محتوهای نامدار رو می‌ده.
		 *
		 * @memberof $cms
		 * @param  {PaginatorParameter} paginatorParameter پارامترهای مورد استفاده در صفحه بندی
		 * @return {promise(PaginatorPage(PNamedContent))}  دستگیره برای دریافت اطلاعا صفحه
		 */
		this.namedContents = function(p){
			var scope = this;
			return $http({
				method : 'GET',
				url : '/api/saascms/page/find',
				params : p.getParameter()
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				page.items = [];
				for (var i = 0; i < res.data.counts; i++) {
					page.items.push(
						scope._retnc(
							res.data.items[i].name,
							res.data.items[i]
						)
					)	;
				}
				return page;
			});
		};
	}

})();
