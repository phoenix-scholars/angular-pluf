(function(){
	
	angular
	.module('pluf.saas')
	.factory('PApplication', [
		'$http', '$q', '$window', 'PApplicationDetail', 'PObject', PApplication
     ]);
	
	function PApplication($http, $q, $window, PApplicationDetail, PObject) {
		
		var pApplication = function() {
			PObject.apply(this, arguments);
		};
		
		pApplication.prototype = new PObject();

		pApplication.prototype.setTenant = function($t) {
			this._tenant = $t;
			return this;
		};
		
		pApplication.prototype.detail = function() {
			if (this._detail) {
				var def = $q.defer();
				def.resolve(this._detail);
				return def.promise;
			}
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/saas/spa/' + this.id + '/detail',
			}).then(function(res) {
				scope._detail = new PApplicationDetail(res.data);
				return scope._detail;
			}, function(data) {
				throw new PException(data);
			});
		};
		
		pApplication.prototype.run = function() {
			$window.location = $window.location.origin + '/' + this._tenant.id
			+ '/' + this.id;
		};

		return pApplication;
	}
	
})();
