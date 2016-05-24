(function(){
	
	angular
	.module('pluf.saas')
	.service('$tenant', [
		'$http', '$httpParamSerializerJQLike', '$q', '$window',//
		'$act', '$usr', 'PTenant', 'PApplication', 'PException', 'PaginatorParameter',
		'PaginatorPage', tenant
     ]);
	
	/*******************************************************************************
	 * $tenant
	 * =============================================================================
	 * یک نسخه نصب شده از نرم افزار را تعیین می‌کند که شامل دسته از کاربران،
	 * تنظیم‌ها، و داده‌ها می‌شود.
	 ******************************************************************************/
	function tenant(//
			$http, $httpParamSerializerJQLike, $q, $window,//
			$act, $usr, PTenant, PApplication, PException, PaginatorParameter,
			PaginatorPage) {
		this._tenant = [];
		/**
		 * ایجاد مدل داده‌ای برای یک ملک
		 * 
		 * همه فراخوانی‌های دا
		 */
		this.ret = function(d) {
			if (d.id in this._tenant) {
				var t = this._tenant[d.id];
				t.setData(d);
				return t;
			}
			var t = new PTenant(d);
			this._tenant[t.id] = t;
			return t;
		}
		/*
		 * نمونه جاری را تعیین می‌:ند
		 */
		this.session = function() {
			var scope = this;
			return $http.get('/api/saas/current').then(function(res) {
				return scope.ret(res.data);
			}, function(res) {
				throw new PException(res.data);
			});
		}
		/*
		 * tenant با شناسه مورد نظر را تعیین می‌کند.
		 */
		this.get = function(id) {
			var scope = this;
			return $http.get('/api/saas/app/' + id)//
			.then(function(res) {
				return scope.ret(res.data);
			}, function(res) {
				throw new PException(res.data);
			});
		}
		/*
		 * با استفاده از این فراخوانی یکی نرم افزار کاربردی جدید ایجاد می‌شود.
		 */
		this.create = function(t) {
			var scope = this;
			return $http({
				method: 'POST',
				url: '/api/saas/app/create?XDEBUG_SESSION_START=ECLIPSE_DBGP&KEY=14513358957011',
				data: $httpParamSerializerJQLike(t),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				return scope.ret(res.data);
			}, function(res) {
				throw new PException(res.data);
			});
		}
		/*
		 * فهرست را تعینن می‌کند
		 */
		this.tenants = function($params) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/saas/app/list',
				params: $params.getParameter(),
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				page.items = [];
				for (var i = 0; i < page.counts; i++) {
					var t = scope.ret(res.data.items[i]);
					page.items.push(t);
				}
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}
		/*
		 * فهرست نرم افزارهای کاربر را تعیین می‌کند
		 */
		this.mine = function(param) {
			if (!param) {
				param = new PaginatorParameter();
			}
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/saas/app/userList',
				params: param.getParameter(),
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				page.items = [];
				for (var i = 0; i < page.counts; i++) {
					var t = scope.ret(res.data.items[i]);
					page.items.push(t);
				}
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}
	}
	
})();

