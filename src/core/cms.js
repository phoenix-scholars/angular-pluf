(function(){
	
	angular
		.module('pluf')
		.service('$cms',[
			'$http', '$httpParamSerializerJQLike', '$q', '$timeout',//
			'PContent',	'PNamedContent', 'PaginatorPage', 'PException',//
			cms
		]);
	
	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $cms
	 * @description
	 *
	 * مهم‌ترین سرویسی است که در این بسته ارائه شده و کار با محتوی و اطلاعات آن را آسان می‌کند.
	 * این سرویس برای جستجو و یا گرفتن اطلاعات هر محتوایی از سیستم کاربرد دارد.
	 */
	function cms($http, $httpParamSerializerJQLike, $q, $timeout,
		PContent, PNamedContent, PaginatorPage, PException) {
		this._nc = {}
		this._getnc = function(id){
			return this._nc[id];
		}
		this._retnc = function(id, d) {
			var i = this._nc[id];
			if (i) {
				i.setData(d);
			} else {
				i = new PNamedContent(d);
				this._nc[id] = i;
			}
			return i;
		}
		this._c ={}
		this._getc = function(id){
			return this._c[id];
		}
		this._retc = function(id, c){
			var i = this._c[id];
			if (i) {
				i.setData(c);
			} else {
				i = new PContent(c);
				this._c[c.id] = i;
			}
			return i;
		}

		/**
		 * این فراخوانی یک ساختار داده‌ای جدید ایجاد می‌کند.
		 *
		 * @memberof $cms
		 * @param contet contet ساختار داده‌ای محتوی برای ایجاد
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
			})
		}
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
			})
		}
		this.contents = function(p){
			var scope = this;
			return $http({
				method : 'GET',
				url : '/api/saascms/contet/find',
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
		}
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
			})
		}
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
			})
		}
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
			}, function(data) {
				throw new PException(data);
			});
		}
	};
	
})();