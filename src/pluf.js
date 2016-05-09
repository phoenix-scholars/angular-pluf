'use strict';

angular.module('pluf', [//
	'pluf.paginator',
	'pluf.user',
	'pluf.core',
	'pluf.cms'
])

/**
	* @ngdoc module
	* @name pluf.core
	* @description
  * ساختار داده‌ای مورد نیاز برای تولید خطا و مدیریت آن را ایجاد می‌کند.
  */
angular.module("pluf.core", [])

 /**
	* @memberof pluf.core
	* @ngdoc factory
	* @name PObject
	*
	* @description
	* مهم‌ترین موجودیت در سیستم است.
	*
	* @attr {Integer} id
	* شناسه موجودیت را تعیین می‌کند.
	*
	* @example
	*   Usage:
	*   <map MAP_OPTIONS_OR_MAP_EVENTS ..>
	*     ... Any children directives
	*   </map>
	*
	*   <map center="[40.74, -74.18]" on-click="doThat()">
	*   </map>
	*
	*   <map geo-fallback-center="[40.74, -74.18]" zoom-to-inlude-markers="true">
	*   </map>
  */
.factory('PObject', function() {
	/**
   * این فراخوانی یک نمونه جدید از این موجودیت ایجاد کرده و مقادیر داده ورودی را به عنوان داده‌های
   * این موجودیت قرار می‌دهد.
   *
   * @memberof PObject
   * @param {data} ساختار داده‌ای موجودیت مورد نظر
	 */
	var pObject = function(data) {
		if (data) {
			this.setData(data);
		}
	}
	pObject.prototype = {
		/**
		 * داده‌های دریافتی را تعیین می‌کند
		 *
		 * @memberof PObject
		 * @param {data} ساختار داده‌ای اولیه
		 */
		setData : function(data) {
			angular.extend(this, data);
		},
		/**
		 * تعیین می‌کند که آیا ساختارهای داده‌ای نشان دارند. زمانی که یک ساختار
		 * داده‌ای شناسه معتبر داشته باشد و سمت کارگذار ذخیره شده باشد به عنوان
		 * یک داده نشان دار در نظر گرفته می‌شود. در غیر این صورت داده نا معتبر بوده و نباید در
		 * پردازش‌ها در نظر گرفته شود.
		 *
		 * نمونه‌ای از کاربردهای این فراخونی تعیین حالت کاربر است. در صورتی که خروجی این
		 * فراخوانی مقدار درستی باشد به معنی نا معتبر بودن کاربر است.
		 *
		 * @memberof PObject
		 * @returns {Boolean} معتبر بودن ساختار داده
		 */
		isAnonymous : function() {
			return !(this.id && this.id > 0);
		},
		/**
		 * تعیین می‌کنه که آیا داده‌های کاربر منقضی شده یا نه. در صورتی که
		 * داده‌ها منقضی شده باشه دیگه نباید از آنها استفاده کرد.
		 *
		 * @memberof PObject
		 * @returns {Boolean} معتبر بودن
		 */
		expire : function() {
			return false;
		}
	};
	return pObject;
})

/**
	* @memberof pluf.core
	* @ngdoc factory
	* @name PException
	* @description
	* ساختار اصلی خطا در کل سیستم را تعریف می‌کند. این ساختار داده‌ای مشابه با ساختارهایی است
	* که در قرارداد پلاف تعیین شده است علاوه بر این امکاناتی برای کار با یک خطای تولید شده دارد.
	*/
.factory('PException', function(PObject) {
	var pException = function() {
		PObject.apply(this, arguments);
	};
	pException.prototype = new PObject();
	return pException;
})


/**
	* @memberof pluf.core
	* @ngdoc factory
	* @name PProgressMonitor
	* @description
 * حالت را در سیستم ایجاد می‌کند از این کلاس برای تعیین حالت بخش‌های متفاوتی از
 * سیستم استفاده می‌شود که ممکن است به صورت پویا تغییر کنند.
 *
 * میزان پیشرفت کار درحقیقت یک مانیتور است که اطلاعاتی راجع به فرآنید انجام کار
 * را تعیین می‌کند. در اینجا موارد زیر برای یک حالت در نظر گرفته شده است:
 *
 * @example
 * <ul>
 * <li>task : string</li>
 * <li>subTask : string</li>
 * <li>state : int {wait:0, working:1, finish:2, error:3}</li>
 * <li>totalWork : int</li>
 * <li>worked : int</li>
 * </ul>
 */
.factory('PProgressMonitor', function(PObject) {
	var PProgressMonitor = function() {
		PObject.apply(this, arguments);
	};
	var pProgressMonitor = function(data) {
		if (data) {
			this._s = 1;
			this._tw = 100;
			this._t = 0;
			this.setData(data);
		}
	};
	pProgressMonitor.prototype = {
		WAIT : 0,
		WORKING : 1,
		FINISH : 2,
		ERROR : 3,
		setWorked : function(w) {
			this._w = w;
			return this;
		},
		addWorked : function(w) {
			if (this._w) {
				this._w += w;
			} else {
				this._w = w;
			}
			return this;
		},
		worked : function() {
			return this._w;
		},
		setTotalWork : function(tw) {
			this._tw = tw;
			return this;
		},
		totalWork : function() {
			return this._tw;
		},
		percentage : function() {
			return this._w * 100 / this._tw;
		},
		setTask : function(t) {
			this._t = t;
			return this;
		},
		task : function() {
			return this._t;
		},
		setSubTask : function(st) {
			this._st = st
			return this;
		},
		subTask : function() {
			return this._st;
		},
		setState : function(s) {
			this._s = s;
			return this;
		},
		state : function() {
			return this._s;
		},
	}
	return pProgressMonitor;
})
/**
 * حالت را تعیین می‌کند
 *
 * @depricated
 */
.factory('PStatus', function(PObject) {
	var pStatus = function() {
		PObject.apply(this, arguments);
	};
	var pStatus = function(data) {
		if (data) {
			this._s = 0;
			this._p = 0;
			this.setData(data);
		}
	};
	pStatus.prototype = {
		setProgress : function(p) {
			this._p = p;
			return this;
		},
		progress : function() {
			return this._p;
		},
		setTask : function(t, sb) {
			this._t = t;
			this._sb = sb;
			return this;
		},
		task : function() {
			return this._t;
		},
		subTask : function() {
			return this._sb;
		},
		setSubTask: function(sb){
			this._sb = sb;
			return this;
		},
		preloading : function(m) {
			this._m = m;
			this._s = 0;
			return this;
		},
		isLoading : function() {
			return this._s == 0;
		},
		loaded : function(m) {
			this._m = m;
			this._s = 1;
			return this;
		},
		isLoaded : function() {
			return this._s == 1;
		},
		error : function(m) {
			this._m = m;
			this._s = 2
			return this;
		},
		isError : function() {
			return this._s == 2;
		},
		message : function() {
			return this._m;
		},
		setMessage: function(m) {
			this._m = m;
			return this;
		}
	}
	return pStatus;
})

/*******************************************************************************
 * $PObject
 * =============================================================================
 ******************************************************************************/
.factory('PPreferenceNode', function(PObject) {
	var pPreferenceNode = function() {
		PObject.apply(this, arguments);
	};
	pPreferenceNode.prototype = new PObject();
	return pPreferenceNode;
})
//
.factory('PPreferenceProperty', function(PPreferenceNode) {
	var pPreferenceProperty = function() {
		PPreferenceNode.apply(this, arguments);
	};
	pPreferenceProperty.prototype = new PPreferenceNode();
	return pPreferenceProperty;
})
/**
 * تنظیم‌های برنامه
 *
 * در بسیاری از بخش‌های سیستم نیازمند وجود یک ساختار برای نگهداری تنظیم‌های کاربر هستیم. این
 * موجودیت این امکان را فراهم می‌کند که کاربر مجموعه‌ای از خصوصیت‌ها را برای خود نگهداری کند.
 * این ساختار توسط برنامه‌های کاربردی ایجادمی‌شود و توسط کاربر قابلیت تنظیم دارد.
 */
.factory('PPreferenceSection',function($rootScope, $q, $timeout, PPreferenceNode,
				PPreferenceProperty, PException) {
			var pPreferenceSection = function() {
				PPreferenceNode.apply(this, arguments);
			};
			pPreferenceSection.prototype = new PPreferenceNode();
			/**
			 * یک بخش دجدید در تنظیم‌ها ایجاد می‌کند.
			 *
			 * بخش در حقیقت یک گره نامدار است که کاربران می‌توانند با استفاده از فراخوانی‌های در نظر
			 * گرفته شده به آن دسترسی داشته باشند.
			 *
			 * @param  section $data داده‌های بخشی که باید ایجاد شود
			 * @return promise       یک دستگیره برای اجرای غیر همزمان
			 */
			pPreferenceSection.prototype.addSection = function($data) {
				var def = $q.defer();
				var scope = this;
				$timeout(function() {
					var section = new pPreferenceSection($data);
					scope[$data.name] = section;
					def.resolve(section);
				}, 1);
				return def.promise;
			}
			/**
			 * یک ساختار را به عنوان داده جدید اضاهف می‌کند.
			 *
			 * @param  property $data خصوصیت مورد نظر
			 * @return promise       قول اجرا
			 */
			pPreferenceSection.prototype.addProperty = function($data) {
				// XXX: maso, 1395: اضافه کردن خصوصیت
			}
			/**
			 * یک گره از خصوصیت‌ها را در اختیار کاربران قرار می‌دهد
			 *
			 * آدرس‌دهی تمام گره‌ها با استفاده از یک مسیر تعیین می‌شود که کاملا شبیه به ادرس دهی‌های
			 * لینوکس است. برای نمونه آدرس زیر یک گره را در ریشه تعیین می‌کند:
			 *
			 * /node-name
			 *
			 * @param  String $path مسیر گره را تعیین می‌‌کند
			 * @return promise  یک فراخوانی غیر همزمان که در اختیار کاربران قرار میگیرد.
			 */
			pPreferenceSection.prototype.node = function($path) {
				if ($path.startsWith("/")) {
					$path = $path.substr(1);
					return $rootScope.appc.node($path);
				}
				var def = $q.defer();
				var scope = this;
				$timeout(function() {
					var $segments = [];
					if ($path.indexOf("/") > -1) {
						$segments = $path.split("/");
					} else {
						$segments.push($path);
					}
					var $node = scope;
					while ($segments.length > 0) {
						var $c = $segments.shift();
						if ($node.hasOwnProperty($c)) {
							$node = $node[$c];
						} else {
							def.reject(new PException("Segment not exist : "
									+ $path));
							return;
						}
					}
					def.resolve($node);
				}, 1);
				return def.promise;
			}
			return pPreferenceSection;
		})

/**
	* @memberof pluf.core
	* @ngdoc service
	* @name $preference
	* @description
	* مدیریت داده‌های محلی کاربر را انجام می‌دهد. این داده‌ها به صورت محلی در
	* مرورگر ذخیره سازی می‌شوند.‌
	*/
.service('$preference', function($rootScope) {
	this.addSection = function($sec) {
		return $rootScope.appc.addSection($sec);
	}
	this.addProperty = function($pro) {
		return $rootScope.appc.addProperty($pro);
	}
	this.node = function($path) {
		return $rootScope.appc.node($path);
	}
	return this;
})

/**
 * تظیم‌های کلی سیستم
 *
 * در کل نرم‌افزار یک موجودیت به نام appc وجود دارد که تمام تنظیم‌های سیستم در آن قرار می‌گیرد
 * به این ترتیب نرم افزارها می‌توانند تنظیم‌های مورد نظر خود را ذخیره کرده و در بخش‌های متفاوت
 * از آن استفاده کنند.
 *
 */
.run(function($rootScope, PPreferenceSection) {
	$rootScope.appc = new PPreferenceSection();
	$rootScope.appc.addSection({
		name : 'pluf',
		title : 'System info',
		description : 'System information section.',
		editable : false,
		hiden : true
	}).then(function(section) {
		return section.addProperty({
			name : 'version',
			title : 'System version',
			description : 'System version',
			editable : false,
		})
	})
})
/**
	* @memberof pluf.core
	* @ngdoc service
	* @name $act
	* @description
 *
 * در این مدل دو مفهوم کلی تعریف می‌شود که عبارتند از دستور و دستگیره. دستور یک عبارت رشته‌ای
 * است که یک عمل مجازی را تعیین می‌کند و دستگیره عملی است که در مقابل هر دستور اجرا
 * می‌شود. برای نمونه فرض کنید که یک دستور ورود به سیستم وجود دارد که نام آن به صورت زیر
 * تعیین شده است:
 *
 * user.login
 *
 * فراخوانی این دستور منجر به اجرا شدن تمام دستگیره‌هایی مرتبط خواهد شد.
 */
.service('$act', function($q, $timeout, PException) {
	this._categories = [];
	this._commands = [];
	/**
	 * ارایه‌ای از دستگیره‌ها است که هر دستگیره بر اساس کلید دستور خود دسته بندی
	 * شده است.
	 */
	this._handlers = [];
	/**
	 * دستور با شناسه تعیین شده را بر می‌گرداند.
	 */
	this.getCommand = function(id) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			for (var i = 0; i < scope._commands.length; i++) {
				if (scope._commands[i].id == id) {
					def.resolve(scope._commands[i]);
					return;
				}
			}
		}, 1);
		return def.promise;
	}
	/**
	 * تمام دستورهایی که در یک دسته قرار دارند را به صورت غیر همزمان تعیین
	 * می‌کند.
	 */
	this.category = function(key) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			if (!(key in scope._categories)) {
				scope._categories[key] = [];
			}
			def.resolve(scope._categories[key]);
		}, 1);
		return def.promise;
	}

	/**
	 * یک دستور جدید را به سیستم اضافه می‌کند
	 */
	this.command = function($c) {
		this._commands.push($c);
		if (!('visible' in $c)) {
			$c.visible = function() {
				return true;
			};
		}
		if (!('enable' in $c)) {
			$c.enable = function() {
				return true;
			};
		}
		if (!('priority' in $c)) {
			$c.priority = 0;
		}
		if ($c.category) {
			if (!($c.category in this._categories)) {
				this._categories[$c.category] = [];
			}
			this._categories[$c.category].push($c);
		}
		if ($c.categories) {
			for (var i = 0; i < $c.categories.length; ++i) {
				if (!($c.categories[i] in this._categories)) {
					this._categories[$c.categories[i]] = [];
				}
				this._categories[$c.categories[i]].push($c);
			}
		}
		return this;
	}

	/**
	 * اضافه کردن دستگیره.
	 */
	this.commandHandler = function($ch) {
		if (!($ch.commandId in this._handlers)) {
			this._handlers[$ch.commandId] = [];
		}
		this._handlers[$ch.commandId].push($ch);
		return this;
	}

	/**
	 * اجرای یک دستور
	 */
	this.execute = function($ci) {
		var scope = this;
		var args = Array.prototype.slice.call(arguments);
		args = args.slice(1);

		if (!($ci in scope._handlers)) {
			var def = $q.defer();
			def.reject(new PException({
				message : 'command not found :' + $ci,
				statuse : 400,
				code : 4404
			}));
			return def.promise;
		}

		var promises = [];
		for (var i = 0; i in scope._handlers[$ci]; i++) {
			var handler = scope._handlers[$ci][i];
			promises.push(handler['handle'].apply(handler, args));
		}
		return $q.all(promises);
	}
})

/**
	* @memberof pluf.core
	* @ngdoc service
	* @name $menu
	* @description
	* مدیریت منوها را ایجاد می‌کند
	*/
.service('$menu', function($q, $timeout, $act, $window) {
	this._menus = [];

	this._addMenu = function(id, menu) {
		if (!(id in this._menus)) {
			this._menus[id] = [];
		}

		// خصوصیت‌های مشترک
		if (!('visible' in menu)) {
			menu.visible = function() {
				return true;
			}
		}
		if (!('enable' in menu)) {
			menu.enable = function() {
				return true;
			}
		}
		this._menus[id].push(menu);
	}

	this.menu = function(id) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			if (!(id in scope._menus)) {
				scope._menus[id] = [];
			}
			def.resolve(scope._menus[id]);
		}, 1);
		return def.promise;
	}

	/**
	 * یک موجودیت جدید را به منو اضافه می‌کند.
	 */
	this.add = function(id, menu) {

		if ('command' in menu) {
			var scope = this;
			$act.getCommand(menu.command).then(function(command) {
				menu.active = function() {
					if (menu.params instanceof Array) {
						var args = [];
						args.push(menu.command);
						for (var i = 0; i < menu.params.length; i++) {
							args.push(menu.params[i]);
						}
						return $act.execute.apply($act, args);
					} else {
						return $act.execute(menu.command);
					}
				}
				if (!('enable' in menu)) {
					menu.enable = function() {
						return command.enable;
					}
				}
				if (!('label' in menu) && ('label' in command)) {
					menu.label = command.label;
				}
				if (!('priority' in menu)) {
					menu.priority = command.priority;
				}
				if (!('description' in menu)) {
					menu.priority = command.description;
				}
				if (!('visible' in menu)) {
					menu.visible = command.visible;
				}
				// XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
				scope._addMenu(id, menu);
			});
		} else if ('action' in menu) {
			menu.active = function() {
				return menu.action();
			}
			// XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
			this._addMenu(id, menu);
		} else if ('link' in menu) {
			menu.active = function() {
				return $window.location = menu.link;
			}
			// XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
			this._addMenu(id, menu);
		}

		return this;
	}
})

/**
	* @memberof pluf.core
	* @ngdoc service
	* @name $notify
	* @description
	* یک سیستم ساده است برای اعلام پیام در سیستم. با استفاده از این کلاس می‌توان
	* پیام‌های متفاوتی که در سیستم وجود دارد را به صورت همگانی اعلام کرد.
	*/
.service('$notify', function($rootScope, $timeout, $q) {
	/*
	 * فهرست شنودگرهای
	 */
	this._info = [];
	this._warning = [];
	this._debug = [];
	this._error = [];
	this._fire = function(list, args) {
		var deferred = $q.defer();
		$timeout(function() {
			for (var i = 0; i < list.length; i++) {
				list[i].apply(list[i], args);
			}
			deferred.resolve();
		}, 10);
		return deferred.promise;
	}
	/*
	 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
	 */
	this.onInfo = function(listener) {
		this._info.push(listener);
		return this;
	}
	/**
	 * تمام واسطه‌های تعیین شده برای پیام را فراخوانی کرده و آنها را پیام ورودی
	 * آگاه می‌کند.
	 */
	this.info = function() {
		return this._fire(this._info, arguments);
	}
	/*
	 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
	 */
	this.onWarning = function(listener) {
		this._warning.push(listener);
		return this;
	}
	/**
	 * تمام پیام‌های اخطاری که در سیستم تولید شده است را به سایر شنودگرها ارسال
	 * کرده و آنها را از بروز آن آگاه می‌کند.
	 */
	this.warning = function() {
		return this._fire(this._warning, arguments);
	}
	/*
	 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
	 */
	this.onDebug = function(listener) {
		this._debug.push(listener);
		return this;
	}
	/**
	 * تمام پیام‌هایی که برای رفع خطا در سیستم تولید می‌شود را برای تمام
	 * شنودگرهای اضافه شده ارسال می‌کند.
	 */
	this.debug = function() {
		return this._fire(this._debug, arguments);
	}
	/*
	 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
	 */
	this.onError = function(listener) {
		this._error.push(listener);
		return this;
	}
	/**
	 * تمام پیام‌های خطای تولید شده در سیتسم را برای تمام شوندگرهایی خطا صادر
	 * کرده و آنها را از آن مطلع می‌کند.
	 */
	this.error = function() {
		return this._fire(this._error, arguments);
	}
	/*
	 * یک رویداد خاص را در کل فضای نرم افزار انتشار می‌دهد. اولین پارامتر ورودی
	 * این تابع به عنوان نام و شناسه در نظر گرفت می‌شود و سایر پارامترها به
	 * عنوان پارامترهای ورودی آن.
	 */
	this.broadcast = function() {
		return $rootScope.$broadcast.apply($rootScope, arguments);
	}
});

/*******************************************************************************
 *                                صفحه بندی
 * =============================================================================
 * بسیاری از داده‌هایی که در سیستم موجود است به صورت صفحه بندی شده در اختیار کاربران قرار
 * می‌گیرد. در این بخش ابزارهایی برای کار با صفحه بندی ارائه شده است.
 ******************************************************************************/
angular.module("pluf.paginator", [])
.factory('PaginatorParameter', function() {
	var pagParam = function(paginatorParam) {
		if (paginatorParam) {
			this.setData(paginatorParam);
		} else {
			this.setData({});
		}
	};
	pagParam.prototype = {
		param : {},
		setData : function(paginatorParam) {
			// angular.extend(this.param, paginatorParam);
			this.param = paginatorParam;
		},
		setSize : function($size) {
			this.param['_px_c'] = $size;
			return this;
		},
		setQuery : function($query) {
			this.param['_px_q'] = $query;
			return this;
		},
		/**
		 * تعیین صفحه مورد نظر
		 *
		 * این فراخوانی صفحه‌ای را تعیین می‌کند که مورد نظر کاربر است. برای نمونه اگر صفحه دوم از
		 * یک کاوش مد نظر باشد باید مقدار یک به عنوان ورودی این تابع استفاده شود.
		 *
		 * اندیس تمام صفحه‌ها از صفر شروع می‌شود. بنابر این صفحه اول اندیس صفر و صفحه دوم
		 * اندیس یک دارد.
		 *
		 * @param  int $page شماره صفحه
		 * @return PaginatorParameter    خود شئی به عنوان خروجی برگردانده می‌شود.
		 */
		setPage : function($page) {
			this.param['_px_p'] = $page;
			return this;
		},
		setOrder : function($key, $order) {
			this.param['_px_sk'] = $key;
			this.param['_px_so'] = $order;
			return this;
		},
		setFilter : function($key, $value) {
			this.param['_px_fk'] = $key;
			this.param['_px_fv'] = $value;
			return this;
		},
		getParameter : function() {
			return this.param;
		}
	};
	return pagParam;
})

/*******************************************************************************
 * $PObject
 * =============================================================================
 * ساختار داده‌ای نرم‌افزار را ایجاد می‌کند.
 ******************************************************************************/
.factory('PaginatorPage', function(PObject) {
	var paginatorPage = function() {
		PObject.apply(this, arguments);
	};
	paginatorPage.prototype = new PObject();
	return paginatorPage;
});

/*******************************************************************************
 * $PObject
 * =============================================================================
 * مدیریت کاربر: این سرویس تنها ابزارهایی را که برای مدیریت عادی یک کاربر مورد
 * نیاز است ارائه می‌کند. برای نمونه ورود به سیستم، خروج و یا به روز کردن
 * تنظیم‌های کاربری. مدیریت کاربران در سطح سیستم در سرویس‌های دیگر ارائه می‌شود.
 ******************************************************************************/

angular.module("pluf.user",[])
/*******************************************************************************
 * $PObject
 * =============================================================================
 ******************************************************************************/
.factory('PProfile', function($http, $httpParamSerializerJQLike, $q, //
PObject, PException//
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
/**
 *
 */
.factory('PUser', function(//
$http, $q, $httpParamSerializerJQLike,//
PObject, PProfile, PException//
) {
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
	}

	/**
	 * پروفایل کاربر را تعیین می‌کند.
	 *
	 * @returns promise قول اجرای غیر هم زمان
	 */
	pUser.prototype.profile = function() {
		if (this.isAnonymous()) {
			var deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		if (this._prof && !this._prof.isAnonymous()) {
			var deferred = $q.defer();
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
	}

	pUser.prototype.isAdministrator = function() {
		return (this.id && this.id > 0 && this.administrator);
	}
	return pUser;
})

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

/*
 *
 */
.run(function($usr, $act) {
	/*
	 * وارد شدن به عنوان یک کاربر به سیستم.
	 */
	$act.command({
		id : 'pluf.user.login',
		label : 'login',
		description : 'login a user',
		visible : function() {
			return $usr.isAnonymous();
		},
		category : 'usr',
	}).commandHandler({
		commandId : 'pluf.user.login',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('no credentioal');
			}
			var a = arguments[0];
			return $usr.login(a.username, a.password);
		}
	})

	/**
	 * خروج کاربر جاری از سیستم
	 */
	.command({
		id : 'pluf.user.logout',
		label : 'logout',
		description : 'logout the user',
		visible : function() {
			return !$usr.isAnonymous();
		},
		category : 'usr',
	}).commandHandler({
		commandId : 'pluf.user.logout',
		handle : function() {
			return $usr.logout();
		}
	})

	/**
	 * دستور به روز کردن اطلاعات کاربر جاری
	 */
	.command({
		id : 'pluf.user.update',
		label : 'update',
		description : 'update the current user',
		visible : function() {
			return !$usr.isAnonymous();
		},
	}).commandHandler({
		commandId : 'pluf.user.update',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('bad param');
			}
			var a = arguments[0];
			return $usr.session().then(function(user) {
				return user.update(a.key, a.value);
			});
		}
	})
	/*
	 *
	 */
	.command({
		id : 'pluf.user.profile.update',
		label : 'update profile',
		description : 'update user profile',
		visible : function() {
			return !$usr.isAnonymous();
		},
	})
	/*
	 *
	 */
	.commandHandler({
		commandId : 'pluf.user.profile.update',
		handle : function() {
			if (arguments.length < 1) {//
				throw new PException('bad param');
			}
			var a = arguments[0];
			return $usr.session().then(function(user) {
				return user.profile();
			}).then(function(profile) {
				return profile.update(a.key, a.value);
			});
		}
	})
})

/*******************************************************************************
 * $cms
 * =============================================================================
 * ساختارهای و  سرویس‌های مورد استفاده در مدیریت منابع را ایجاد می‌کند. این ساختارهای در
 * ایجاد صفحه‌های متفاوتی از سایت که به صورت ایستا ایجاد می‌شوند کاربرد دارند.
 ******************************************************************************/
angular.module("pluf.cms",[])
.factory('PContent', function($http, $httpParamSerializerJQLike, $q, PObject,
	PException) {
	var pContent = function() {
		PObject.apply(this, arguments);
	};
 	pContent.prototype = new PObject();
	// XXX:maso, 1395: به روز کردن محتوی
	pContent.prototype.update = function(){
	}
	// XXX:maso, 1395: حذف محتوی
	pContent.prototype.delete = function(){
	}
	// XXX: maso, 1395: محتوی صفحه را می‌دهد
	pContent.prototype.value = function(){
		// if(this._cvalue()){
		// 	var deferred = $q.defer();
		// 	deferred.resolve(this._cvalue());
		// 	return deferred.promise;
		// }
		return $http({
			method: 'GET',
			url: '/api/saascms/content/'+this.id+'/download'
		}).then(function(res){
			// scope._setCvalue(res.data);
			return res.data;
		})
	}
	pContent.prototype.setValue = function(d){
		var scope = this;
		return $http({
			method:'POST',
			url: '/api/saascms/content/'+this.id+'/download',
			data: d,
		}).then(function(res){
			return scope;
		});
	}
 	return pContent;
 })
.factory('PNamedContent', function($http, $httpParamSerializerJQLike, $q,
	PObject, PException, PContent){
	var pNamedContent = function() {
		PObject.apply(this, arguments);
	};
	pNamedContent.prototype = new PObject();
	// XXX: maso, 1395: به روز کردن صفحه
	pNamedContent.prototype.update = function(){
	}
	// XXX: maso, 1395: حذف صفحه
	pNamedContent.prototype.delete = function(){
	}
	// // XXX: maso, 1395: تعیین محتوی
	// pNamedContent.prototype.content = function(){
	// 	var deferred = $q.defer();
	// 	deferred.resolve(new PContent({id:2}));
	// 	return deferred.promise;
	// }
	pNamedContent.prototype.value = function(){
		return this.content.value();
	}
	pNamedContent.prototype.setValue = function(v){
		return this.content.setValue(v);
	}
	return pNamedContent;
})
.service('$cms', function($http, $httpParamSerializerJQLike, $q, $timeout,
	$act, $window, PContent,
	PNamedContent,
	PaginatorPage, PException) {
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
		}).catch(function(data) {
			throw new PException(data);
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
})
