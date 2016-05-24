/**
 *
 */
.service('$usr', function(//
$http, $httpParamSerializerJQLike, $q,//
$act, PUser, PException//
) {
	this._su = new PUser()
	this._u = {}
	this._getUser = function(id) {
		return this._u[id];
	}
	this._setUser = function(u) {
		this._u[u.id] = u;
	}
	this._ret = function(id, data) {
		var instance = this._getUser(id);
		if (instance) {
			instance.setData(data);
		} else {
			instance = new PUser(data);
			this._setUser(instance);
		}
		return instance;
	}

	/**
	 * به صورت همزمان تعیین می‌کند که آیا کاربر جاری شناخته شده است یا نه.
	 */
	this.isAnonymous = function() {
		return this._su.isAnonymous()
	}
	this.isAdministrator = function() {
		return this._su.isAdministrator();
	}
	/**
	 * ورود کاربر به سیستم
	 */
	this.login = function($login, $password) {
		if (!this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this);
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/login',
			data : $httpParamSerializerJQLike({
				'login' : $login,
				'password' : $password
			}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function() {
			return scope.session();
		}, function(data) {
			throw new PException(data);
		}).then(function(data) {
			// scope._su = new PUser(data.data);
			return data;
		}, function(data) {
			throw new PException(data);
		});
	}
	/**
	 * کاربری که در نشست تعیین شده است را بازیابی می‌کند.
	 *
	 * @returns promise قول اجرای غیر هم زمان
	 */
	this.session = function() {
		var scope = this;
		if (!this._su.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this._su);
			return deferred.promise;
		}
		return $http.get('/api/user/account').then(function(data) {
			scope._su = new PUser(data.data);
			return scope._su;
		}, function(data) {
			throw new PException(data);
		});
	}
	/**
	 * خروج از سیستم
	 */
	this.logout = function() {
		if (this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.resolve(this);
			return deferred.promise;
		}
		var scope = this;
		return $http.get('/api/user/logout')//
		.success(function(data) {
			scope._su.setData({
				id : 0,
				login : null,
				administrator: false
			});
			return scope._su;
		})//
		.error(function(data) {
			throw new PException(data);
		});
	}

	/**
	 * ثبت نام یک کاربر جدید
	 */
	this.signup = function(detail) {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/signup',
			data : $httpParamSerializerJQLike(detail),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			var user = new PUser(data.data);
			return user;
		}, function(data) {
			throw new PException(data);
		});
	}
	/**
	 * فهرست کاربران را به صورت صفحه بندی شده در اختیار قرار می‌دهد. این فهرست
	 * برای کاربردهای متفاوتی استفاده می‌شود مثل اضافه کردن به کاربران مجاز.
	 */
	this.users = function(p) {
		var scope = this;
		return $http({
			method : 'GET',
			url : '/api/user/find',
			params : p.getParameter()
		}).then(function(data) {
			var page = new PaginatorPage(res.data);
			var items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope._ret(page.items[i].id, page.items[i]);
				items.push(t);
			}
			page.items = items;
			return page;
		}, function(data) {
			throw new PException(data);
		});
	}

	/**
	 * کاربر مورد نظر با شناسه تعیین شده را دریافت کرده و به عنوان نتیجه
	 * برمی‌گرداند.
	 */
	this.user = function(login) {
		var scope = this;
		return $http({
			method : 'GET',
			url : '/api/user/user/' + login,
		}).then(function(data) {
			var t = scope._ret(data.data.id, data.data);
			return t;
		}, function(data) {
			throw new PException(data);
		});
	}
})