(function(){
	
	angular
	.module('saas')
	.factory('PTenant', [
		'$http', '$httpParamSerializerJQLike', '$location', '$window', '$q',
		'PObject', 'PException', 'PProfile', 'PApplication', 
		'PaginatorParameter', 'PaginatorPage', PTenant
     ]);
	
	/*******************************************************************************
	 * PTenant
	 * =============================================================================
	 * ساختار داده‌ای یک ملک را تعیین می‌کنه
	 ******************************************************************************/
	function PTenant($http, $httpParamSerializerJQLike, $location, $window, $q,
			PObject, PException, PProfile, PApplication, 
			PaginatorParameter, PaginatorPage) {
		var pTenant = function() {
			PObject.apply(this, arguments);
		};
		pTenant.prototype = new PObject();

		pTenant.prototype._pool = [];
		pTenant.prototype.ret = function(d) {
			if (d.id in this._pool) {
				var t = this._pool[d.id];
				t.setData(d);
				return t;
			}
			var t = new PApplication(d).setTenant(this);
			this._pool[t.id] = t;
			return t;
		}
		pTenant.prototype.update = function(key, value) {
			var scope = this;
			var par = {};
			par[key] = value;
			return $http({
				method: 'POST',
				url: '/api/saas/' + this.id,
				data: $httpParamSerializerJQLike(par),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				scope.setData(res.data);
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		}
		/*
		 * اعضای یک نرم‌افزار کاربردی را تعیین می‌کند.
		 */
		pTenant.prototype.members = function() {
			if (this.isAnonymous() || this.memberLoaded()) {
				var deferred = $q.defer();
				if (this.isAnonymous())
					deferred.reject('authentication requried');
				else
					deferred.resolve(this._member);
				return deferred.promise;
			}
			var scope = tenantService;
			return $http({
				method: 'GET',
				url: '/api/saas/app/' + $application.id + '/member/list'
			}).then(function(res) {
				scope.$member.setData(res.data);
				return scope.$member;
			}, function(data) {
				throw new PException(data);
			});
		}
		/*
		 * فهرست تمام نرم‌افزارهایی را تعیین می‌کند که این ناحیه حق استفاده از
		 * آنها را دارد.
		 */
		pTenant.prototype.apps = function($params) {
			if (!$params) {
				$params = new PaginatorParameter();
			}
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/' + this.id + '/saas/spa/find',
				params: $params.getParameter(),
			}).then(function(res) {
				var page = new PaginatorPage(res.data);
				var items = [];
				for (var i = 0; i < page.counts; i++) {
					var t = scope.ret(page.items[i]);
					items.push(t);
				}
				page.items = items;
				return page;
			}, function(data) {
				throw new PException(data);
			});
		}
		pTenant.prototype.app = function(appName) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/saas/spa/' + appName,
			}).then(function(res) {
				var t = scope.ret(res.data);
				return t;
			}, function(data) {
				throw new PException(data);
			});
		}
		pTenant.prototype.run = function() {
			// XXX: maso, 1394: Check domain, subdomain and id
			$window.location = $window.location.origin + '/' + this.id;
		}

		return pTenant;
	}
	
	
})();
