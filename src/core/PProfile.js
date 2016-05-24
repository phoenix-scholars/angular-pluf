/*******************************************************************************
 * $PObject
 * =============================================================================
 ******************************************************************************/
.factory('PProfile', function(
	$http,
	$httpParamSerializerJQLike,
	$q,
	PObject,
	PException
) {
	/**
	 * یک نمونه جدید از این موجودیت ایجاد می کند.
	 */
	var pProfile = function() {
		PObject.apply(this, arguments);
	};
	pProfile.prototype = new PObject();

	/**
	 * به روز رسانی پروفایل کاربری
	 */
	pProfile.prototype.update = function(key, value) {
		if (this.user.isAnonymous()) {
			var deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		var scope = this;
		var param = {};
		param[key] = value;
		return $http({
			method : 'POST',
			url : '/api/user/profile',
			data : $httpParamSerializerJQLike(param),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	}

	return pProfile;
})