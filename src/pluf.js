'use strict';

angular.module('pluf', [//
	'pluf.core',
	'pluf.user',
	'pluf.cms'
])

/**
	* @ngdoc module
	* @name pluf.core
	* @description
	*
	* ساختارهای داده‌ای پایه‌ای و مدیریت آنها در این ماژول پیاده سازی شده است. این ساختارهای داده‌ای
	* کاربردهای مانند مدیریت خطا، صفحه بندی و ساختار اولیه موجودیت‌ها در سیستم را ایجاد می‌کند. این
	* ساختارها در تمام ماژولها در دسترس است.
  *
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
		 * زمانی که دوره زمانی زیادی از یک موجودیت گذشته باشد و با سرور هماهنگ نشده باشد نیز
		 * مقدار این تابع درستی خواهد بود از این رو سرویس‌ها باید این مدل داده‌ها را نادیده بگیرند. این
		 * روش در مدیریت کش کاربرد دارد.
		 *
		 * @memberof PObject
		 * @returns {Boolean} معتبر بودن ساختار داده
		 */
		isAnonymous : function() {
			return !(this.id && this.id > 0);
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
	*
	* ساختار داده‌ای خطا بسته به حالت سرور می‌تواند متفاوت باشد. زمانی که سرور در حالت رفع خطا
	* باشد، اطلاعات بیشتری در این ساختار داده‌ای وجود دارد اما در حالت نهایی تنها اطلاعات مورد نیاز
	* برای کاربران وجود خواهد داشت.
	*
	* در پروژه سین (https://gitlab.com/phoenix-scholars/seen) فهرست کامل پارامترهای ارسالی
	* از سمت سرور و کدهای خطا تعیین شده است. در اینجا فهرست مهم‌ترین خصوصیت‌های این ساختار
	* بیان شده است.
	*
	* @attr {Integer} state کد خطای تولید شده که بر اساس استاندارد کدهای HTTP تعیین می‌شود.
	* @attr {Integer} code کد خطای ایجاد شده که بر اساس ساختارهای سرور و پرتکل سین تعیین می‌شود
	* @attr {String} message پیام ارسالی از سمت سرور
	* @attr {url} link آدرسی که در آن اطلاعات بیشتری در این رابطه وجود دارد
	* @attr {Struct} data ساختار داده‌ای متناسب با خطا. در این ساختار اگر خطا در رابطه با یک پارامتر ورودی باشد تعیین خواهد شد.
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
 *  // Start
 *  PProgressMonitor monitor = new PProgressMonitor();
 *  // Init
 *  monitor.setTask("task name")
 *  	.setTotalWork(10)
 *  	.setWorked(0)
 *  	.setState(PProgressMonitor.WORKING);
 *  var i = 0;
 *  for(i = 0; i < 10; i++){
 *  	//Do something
 *  	monitor
 *  		.setWorked(i)
 *  		.setSubTask('Sub task title:'+i);
 *  }
 *  monitor
 *  	.setState(PProgressMonitor.FINISH);
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
		/**
		 * حالت انتظار برای این پیشرفت کار را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @type {Number}
		 */
		WAIT : 0,
		/**
		 * حالت انجام کار را تعیین می‌کند
		 * @memberof PProgressMonitor
		 * @type {Number}
		 */
		WORKING : 1,
		/**
		 * حالت پایان را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @type {Number}
		 */
		FINISH : 2,
		/**
		 * حالت خطا را برای کار تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @type {Number}
		 */
		ERROR : 3,
		/**
		 * تعداد کل کارهایی که تا حال انجام شده را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @param  {Integer} w تعداد کل کارها
		 * @return {PProgressMonitor}   خود پیشرفت کار را به عنوان خروجی برمی‌گرداند
		 */
		setWorked : function(w) {
			this._w = w;
			return this;
		},
		/**
		 * به میزان کار انجام شده یک تعداد ثابت اضافه می‌کند.
		 * @memberof PProgressMonitor
		 * @param  {Integer} w تعداد کار انجام شده جدید
		 * @return {PProgressMonitor}   خود ساختار داده‌ای پیشرفت کار
		 */
		addWorked : function(w) {
			if (this._w) {
				this._w += w;
			} else {
				this._w = w;
			}
			return this;
		},
		/**
		 * تعداد کارهایی که انجام شده است را تعیین می‌کند. این مقدار در متغیری به نام _w ذخیره می‌شود
		 * که می‌تواند در نمایش نیز به کار رود اما توصیه می‌کنم که او همین فراخوانی در نمایش استفاده
		 * کنید.
		 * @memberof PProgressMonitor
		 * @return {Integer} تعداد کارها
		 */
		worked : function() {
			return this._w;
		},
		/**
		 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @param  {Integer} tw تعداد کل کارهایی که باید انجام شود.
		 * @return {PProgressMonitor}  خود ساختار داده‌ای پیشرفت کار.
		 */
		setTotalWork : function(tw) {
			this._tw = tw;
			return this;
		},
		/**
		 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @return {Integer} تعداد کل کارها
		 */
		totalWork : function() {
			return this._tw;
		},
		/**
		 * میزان پیشرفت کار را به درصد تعیین می‌کند. این مقدار با روش ساده تقسم به دست می‌آیدکه
		 * از رابطه زیر پیروی می‌کند:
		 *
		 * P = worked / totalWork * 100
		 *
		 * در صورتی که مقادیر اشتباهی برای تعداد کل کارها و کارهای انجام شده تعیین شده باشد مقدار
		 * -۱ به عنوان نتیجه برگردانده خواهد شد.
		 * @memberof PProgressMonitor
		 * @return {Number} درصد پیشرفت کار
		 */
		percentage : function() {
			return this._w * 100 / this._tw;
		},
		/**
		 * عنوان کار اصلی را تعیین می‌کند. این عنوان در نمایش به کار گرفته می‌شود.
		 * @memberof PProgressMonitor
		 * @param  {String} t عنوان اصلی کار
		 * @return {PProgressMonitor}  خود ساختار داده‌ای
		 */
		setTask : function(t) {
			this._t = t;
			return this;
		},
		/**
		 * عنوان اصل کار را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @return {String} عنوان اصلی کار
		 */
		task : function() {
			return this._t;
		},
		/**
		 * عنوان کار جاری را تعیین می‌کند. در این مدل فرض کرده‌ایم که هر کار از چندین زیر وظیفه
		 * تشکیل می‌شود که در دوره‌های زمانی به صورت پشت سر هم انجام می‌شوند.
		 * @param  {String} st عنوان زیر وظیفه
		 * @return {PProgressMonitor}    خود ساختار داده‌ای پیشرفت کار.
		 */
		setSubTask : function(st) {
			this._st = st
			return this;
		},
		/**
		 * عنوان زیر وظیفه را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @return {String} عنوان زیر وظیفه
		 */
		subTask : function() {
			return this._st;
		},
		/**
		 * حالت زیر این کار را تعیین می‌کند. حالت با استفاده از یک عدد تعیین می‌شود که مقادیر متفاوت
		 * آن معانی خاصی دارد. این مقادر در توصیف این موجودیت آورده شده است.
		 * @memberof PProgressMonitor
		 * @param  {Integer} s حالت کار
		 * @return {PProgressMonitor}   خود ساختار داده‌ای
		 */
		setState : function(s) {
			this._s = s;
			return this;
		},
		/**
		 * حالت کار را تعیین می‌کند.
		 * @memberof PProgressMonitor
		 * @return {Integer} حالت کار
		 */
		state : function() {
			return this._s;
		},
		/**
		 * پایان یافتن کار را تعیین می‌کند. در صورتی که کار با موفقیت و یا عدم موفقیت تمام شود این
		 * فراخوانی مقدار درستی را برمی‌گرداند.
		 * @memberof PProgressMonitor
		 * @return {Boolean} درستی در صورت پایان کار
		 */
		isDone : function() {
			return this._s == this.FINISH;
		}
	}
	return pProgressMonitor;
})

/**
 * @memberof pluf.core
 * @ngdoc factory
 * @name PPreferenceNode
 * @description
 *
 * یک تنظیم در سیستم را تعیین می‌کند. سیستم تنظیم‌ها به صورت یک درخت در نظر گرفته می‌شود
 * که در آن هر گره معادل با یک تنظیم در سیستم است. این سیستم برای ایجاد تنظیم‌های کاربری
 * در نمایش به کار گرفته می‌شود. برای نمونه زبان برنامه، لایه بندی آن و یا تم مورد استفاده از
 * مواردی است که در این تنظیم‌ها قرار می‌گیرد.
 *
 * این تنظیم‌ها سمت کاربر نگهداری می‌شود و برنامه کاربری می‌تواند آنها را برای اجرای بعدی نگهداری
 * کند.
 */
.factory('PPreferenceNode', function(PObject) {
	var pPreferenceNode = function() {
		PObject.apply(this, arguments);
	};
	pPreferenceNode.prototype = new PObject();
	/**
	 * یک بخش دجدید در تنظیم‌ها ایجاد می‌کند.
	 *
	 * بخش در حقیقت یک گره نامدار است که کاربران می‌توانند با استفاده از فراخوانی‌های در نظر
	 * گرفته شده به آن دسترسی داشته باشند.
	 * @memberof PPreferenceNode
	 * @param  {String} n نام گره جدید در تنظیم‌ها
	 * @return {promise(PPreferenceNode)} قول برای ایجاد گره جدید
	 */
	pPreferenceNode.prototype.newNode = function(n) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			var node = new pPreferenceNode();
			scope.children[n] = section;
			def.resolve(node);
			//XXX: maso, 1395: ذخیره کرده تنظیم‌های جدید
		}, 1);
		return def.promise;
	}
	/**
	 * گره تعیین شده با نام را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof PPreferenceNode
	 * @param  {String} n نام گره مورد نظر
	 * @return {PaginatorPage(PPreferenceNode)}  زیرگره معادل
	 */
	pPreferenceNode.prototype.node = function(n) {
		//XXX: maso, 1395: از بین بچه‌ها گره مناسب را پیدا کرده و به عنو نتیجه برمی‌گرداند
	}
	/**
	 * تمام زیر گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد.
	 * @memberof PPreferenceNode
	 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}   گره‌ها به صورت صفحه بندی شده.
	 */
	pPreferenceNode.prototype.nodes = function(p) {
		//XXX: maso, 1395:
	}
	/**
	 * گره پدر را تعیین می‌کند.
	 * @memberof PPreferenceNode
	 * @return {promise(PPreferenceNode)} یک دستگیره برای انجام کار
	 */
	pPreferenceNode.prototype.parent = function() {
		//XXX: maso, 1395:
	}
	return pPreferenceNode;
})
/**
 * @memberof pluf.core
 * @ngdoc factory
 * @name PPreferenceProperty
 * @description
 *
 * ساختار یک تنظیم را تعیین می‌کند که در یک گره از تنظیم‌ها قرار می‌گیرد. همانگونه که گفته شد، هر
 * گره می‌تواند شامل مجموعه‌ای از تنظیم‌ها باشد. تمام تنظیم‌های موجود در هر گره  با استفاده از این
 * ساختارها ایجاد می‌شوند.
 */
.factory('PPreferenceProperty', function(PPreferenceNode) {
	var pPreferenceProperty = function() {
		PPreferenceNode.apply(this, arguments);
	};
	pPreferenceProperty.prototype = new PPreferenceNode();
	/**
	 * مقدار جدید را برای این خصوصیت تعیین می‌کند
	 * @param {Object} v مقدار جدید
	 */
	pPreferenceProperty.prototype.setValue = function(v){}
	/**
	 * مقدار خصوصیت را تعیین می‌:کند.
	 * @return {Object} مقدار خصوصیت
	 */
	pPreferenceProperty.prototype.value = function(){}
	return pPreferenceProperty;
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
	/**
	 * یک گره با نام جدید ایجاد می‌کند
	 * @memberof $preference
	 * @param  {String} n نام گره
	 * @return {promise(PPreferenceNode)}   دستگیره گره جدید
	 */
	this.newNode = function(n) {}
	/**
	 * گره با مسیر تعیین شده را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof $preference
	 * @param  {String} path گره تنظیم‌ها
	 * @return {promise(PPreferenceNode)}     گره مورد نظر
	 */
	this.node = function(path) {}
	/**
	 * فهرست همه گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد
	 * @memberof $preference
	 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}  دستگیره فهرست گره‌ها
	 */
	this.nodes = function(p) {}
	return this;
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
})

/*******************************************************************************
 *                                صفحه بندی
 * =============================================================================
 * بسیاری از داده‌هایی که در سیستم موجود است به صورت صفحه بندی شده در اختیار کاربران قرار
 * می‌گیرد. در این بخش ابزارهایی برای کار با صفحه بندی ارائه شده است.
 ******************************************************************************/
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

/**
 * @ngdoc module
 * @name pluf.cms
 * @description
 * ساختارهای و  سرویس‌های مورد استفاده در مدیریت منابع را ایجاد می‌کند. این ساختارهای در
 * ایجاد صفحه‌های متفاوتی از سایت که به صورت ایستا ایجاد می‌شوند کاربرد دارند.
 */
angular.module("pluf.cms",[])
/**
 * @memberof pluf.cms
 * @ngdoc factory
 * @name PContent
 * @description
 * ساختار داده‌ای محتوی را ایجاد می‌کند. این ساختار داده‌ای شامل اطلاعات کلی از محتوی است که
 * از این میان می‌توان به موارد زیر اشاره کرد:
 *
 * <ul>
 * 	<li>id</li>
 * 	<li>name</li>
 * 	<li>mimetype</li>
 * 	<li>tenant</li>
 * </ul>
 */
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
/**
 * @memberof pluf.cms
 * @ngdoc factory
 * @name PNamedContent
 * @description
 * ساختار داده‌ای و ابزارهای مورد نیاز با یک محتوی نامدار را تعیین می‌کند. محتوی نام دار یک محتوی
 * است که با استفاده از یک نام منحصر به فرد قابل دسترسی است. از این مدل محتوی در جایی
 * استفاده می‌شود که شناسه محتوی مهم نیست و محتوی به هر شکلی باید موجود باشد.
 *
 * برای نمونه محتویی که در صفحه اول یک سایت نمایش داده می‌شود، مستقل از این که شناسه آن
 * چیست و در چه زمانی ایجاد شده است می‌تواند با نام مشخض به صورت زیر در دسترس باشد:
 *
 * <pre><code>
 * $cms.namedContent('main').then(function(nc){
 * 	$scope.namedContent = nc;
 * 	return nc.value();
 * }).then(function(content){
 * 	// Put content in your view
 * })
 * </code></pre>
 */
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

/**
 * @memberof pluf.cms
 * @ngdoc service
 * @name $cms
 * @description
 *
 * مهم‌ترین سرویسی است که در این بسته ارائه شده و کار با محتوی و اطلاعات آن را آسان می‌کند.
 * این سرویس برای جستجو و یا گرفتن اطلاعات هر محتوایی از سیستم کاربرد دارد.
 */
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
