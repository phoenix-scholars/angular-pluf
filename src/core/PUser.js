/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PUser', [
			'$http', '$q', '$httpParamSerializerJQLike', 'PObject', 'PProfile', 'PException',
			PUser
		]);

	/**
	 * @memberof pluf
	 * @ngdoc factory
	 * @name PUser
	 * @description
	 * مدل کلی کاربر را در سیستم تعیین می‌کند.
	 */
	function PUser($http, $q, $httpParamSerializerJQLike, PObject, PProfile, PException) {
		var pUser = function() {
			PObject.apply(this, arguments);
		};
		pUser.prototype = new PObject();

		/**
		 * به روز کردن اطلاعات کاربر
		 */
		pUser.prototype.update = function(key, value) {
			var deferred = $q.defer();
			var scope = this;
			var param = {};
			if (typeof key != 'undefined' && typeof value != 'undefined') {
				param[key] = value;
			} else {
				param = this;
			}
			return $http({
				method : 'POST',
				url : '/api/user/' + this.id,
				data : $httpParamSerializerJQLike(param),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).then(function(data) {
				scope.setData(data.data);
				return scope;
			}, function(data) {
				throw new PException(data);
			});
		};

		/**
		 * پروفایل کاربر را تعیین می‌کند.
		 *
		 * @returns promise قول اجرای غیر هم زمان
		 */
		pUser.prototype.profile = function() {
			var deferred;
			if (this.isAnonymous()) {
				deferred = $q.defer();
				deferred.reject();
				return deferred.promise;
			}
			if (this._prof && !this._prof.isAnonymous()) {
				deferred = $q.defer();
				deferred.resolve(this._prof);
				return deferred.promise;
			}
			var scope = this;
			return $http({
				method : 'GET',
				url : '/api/user/' + this.id + '/profile',
			}).then(function(res) {
				scope._prof = new PProfile(res.data);
				scope._prof.user = scope;
				return scope._prof;
			}, function(res) {
				throw new PException(res.data);
			});
		};

		pUser.prototype.isAdministrator = function() {
			return (this.id && this.id > 0 && this.administrator);
		};
		return pUser;
	}

//End
})();
