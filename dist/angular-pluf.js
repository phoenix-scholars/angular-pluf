/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
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
angular.module('pluf', [])
.run(function($usr, $act, PException) {
	$act.command({
		id : 'pluf.user.login',
		label : 'login',
		description : 'login a user',
		visible : function() {
			return $usr.isAnonymous();
		},
		category : 'usr',
	})
	.handler({
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
	}).handler({
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
	}).handler({
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
	}).handler({
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
	});
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc factory
 * @name PCommand
 * @description
 * ساختار داده‌ای دستور را تعیین می‌کند. این ساختار داده‌ای به صورت داخلی استفاده می‌شود و برای نگهداری
 * دستورهایی است که کاربران به سیستم اضافه می‌کنند. مهم‌ترین پارامتر موجود در این ساختار داده‌ای
 * فهرستی از دستگیره‌ها است که در ازای اجرا این دستور اجرا خواهند شد.
 */
.factory('PCommand',function () {
  var pCommand  = function(data) {
    this.priority = 0;
    this.tags = [];
    if (data) {
      this.setData(data);
    }
    this.handlers = [];
    if (!('visible' in data)) {
			this.visible = function() {return true;};
		}
		if (!('enable' in data)) {
			this.enable = function() { return true; };
		}
  };
  /**
   * داده‌های اولیه دستور را تعیین می‌کند.
   *
   * @memberof PCommand
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {pCommand}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pCommand.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * یک دستگیره جدید را به فهرست دستگیره‌های موجود در این دستور اضافه می‌کند.
   *
   * @memberof PCommand
   * @param  {PHandler} handler دستگیره جدید برای این دستور
   * @return {PCommand}   خود دستور به عنوان نتیجه برگردانده می‌شود.
   */
  pCommand.prototype.handler = function(h){
    this.handlers.push(h);
    return this;
  };
  /**
   * یک برچسب جدید به این دستور اضافه می‌کند. هر دستور یک فهرست از برچسب‌ها دارد که یک
   * حالت و دسته خاص از دستورها را نشان می‌دهد. اضافه کردن برچسب به دستور خیلی ساده انجام
   * می‌شود:
   *
   * <pre><code>
   * 	var cmd = new PCommand();
   * 	...
   * 	cmd
   * 		.tag('menu')
   * 		.tag('usr')
   * 		.tag('login');
   * </code></pre>
   *
   *	فهرست برچسب‌ها را می‌توان در زمان تعریف یک دستور نیز تعیین کرد:
   *
   * <pre><code>
   * 	$act.command({
   * 		id: 'user.login',
   * 		lable: 'login',
   * 		tags:['menu', 'user', 'login']
   * 	});
   * </code></pre>
   *
   * برای اینکه از این برچسب‌ها توی لایه نمایش و یا اینکه پردازش‌های دیگه استفاده کنید کافی هست که
   * به صورت مستقیم از فهرست برچسب‌ها استفاده کنید. برای نمونه کد زیر یک دستور را نمایش داده
   * و با کلیک کردن کاربر روی آن اجرا می‌کند:
   *
   * اولین کاری که باید بکنید تعریف کردن دستور و دستیگره مناسب برای اون هست:
   * <pre><code>
   * app.run(function($act){
   * 	$act.command({
   * 		id: 'info.command',
   * 		label: 'Show info',
   * 		tags: ['x', 'y']
   * 	}).handler({
   * 		command: 'info.command',
   * 		handle: function(message){
   * 			alert(message);
   * 		}
   * 	});
   * });
   * </code></pre>
   *
   * بعد این دستور رو به یک متغیر توی فضای نمایش میدیم که قابل نمایش باشه:
   * <pre><code>
   * 	app.controller('CommandController', function($scope, $act){
   * 		$scope.execute = function(){
   * 			$act.execute(arguments);
   * 		};
   * 		$act.getCommand('info.command').then(function(cmd){
   * 			$scope.cmd = cmd;
   * 		});
   * 	});
   * </code></pre>
   *
   * حالا کافی هست که توی نمایش این دستور رو نشون بدیم
   * <pre><code>
   * 	<div ng-click="execute(cmd.id, 'this is example message')">
   *  	<h3>{{cmd.label}}</h3>
   *  	<ul>
   *  		<li ng-repeate="tag in cmd.tags">{{tag}}</li>
   *  	</ul>
   * 	</div>
   * </code></pre>
   *
   * @memberof PCommand
   * @param  {string} tag برچسب جدید
   * @return {PCommand}   خود دستور را به عنوان نتیجه برمی‌گرداند.
   */
  pCommand.prototype.tag = function(tag){
    this.tags.push(tag);
  };
  return pCommand;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PContent
 * @description ساختار داده‌ای محتوی را ایجاد می‌کند. این ساختار داده‌ای شامل
 *              اطلاعات کلی از محتوی است که از این میان می‌توان به موارد زیر
 *              اشاره کرد:
 * 
 * @attr {integer} id
 * @attr {string} name
 * @attr {string} mimetype
 * @attr {integer} tenant
 */
.factory('PContent', function($http, $httpParamSerializerJQLike, $q, PObject) {

	function _initContent(scope) {
		scope.link = '/api/saascms/content/' + scope.id + '/download';
	}

	var pContent = function() {
		PObject.apply(this, arguments);
		_initContent(this);
	};
	pContent.prototype = new PObject();

	/**
	 * محتوی را به روز می‌کند
	 * 
	 * @memberof PContent
	 * @return {promise} محتوی جدید ایجاد شده
	 */
	pContent.prototype.update = function() {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/saascms/content/' + this.id,
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
			_initContent(scope);
			return scope;
		});
	};

	/**
	 * محتوی را حذف می‌کند
	 * 
	 * @memberof PContent
	 * @return {promise} محتوی حذف شده
	 */
	pContent.prototype.remove = function() {
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/saascms/content/' + this.id
		}).then(function() {
			delete scope.id;
			return scope;
		});
	};

	/**
	 * مقدار محتوی را تعیین می‌کند که معمولا برای گرفتن محتوی ساختار یافته و
	 * رشته‌ها مناسب است. در سایر موارد استفاده از پیوند محتوی بهتر است.
	 * 
	 * @memberof PContent
	 * @return {promise} مقدار محتوی
	 */
	pContent.prototype.value = function() {
		// TODO: maso, 1395: محتوی صفحه را می‌دهد
		// if(this._cvalue()){
		// var deferred = $q.defer();
		// deferred.resolve(this._cvalue());
		// return deferred.promise;
		// }
		return $http({
			method : 'GET',
			url : this.link
		}).then(function(res) {
			// scope._setCvalue(res.data);
			return res.data;
		});
	};

	/**
	 * مقدار جدیدی را برای این محتوی تعیین می‌کند.
	 * 
	 * @memberof PContent
	 * @param {object}
	 *            data مقدار جدید برای محتوی
	 * @return {promise} محتوی به روز شده
	 */
	pContent.prototype.setValue = function(newValue) {
		var scope = this;
		return $http({
			method : 'POST',
			url : this.link,
			data : newValue,
		}).then(function() {
			return scope;
		});
	};

	/**
	 * یک فایل را به عنوان مقدار بار می‌کند
	 * 
	 * ورودی باید فایل جاوسکریپت باشه.
	 * 
	 * @param file
	 * @returns
	 */
	pContent.prototype.upload = function(file) {
		var fd = new FormData();
		fd.append('file', file);
		return $http.post(this.link, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		});
	};

	return pContent;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')


/**
 * @memberof pluf
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
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc factory
 * @name PHandler
 * @description
 * ساختار داده‌ای برای یک دستگیره را ایجاد می‌کند. دستگیره یک عمل اجرایی است که در مقابل فراخوانی
 * یک دستور در سیستم اجرا می‌شود.
 */
.factory('PHandler', function() {
  var pHandler  = function(data) {
    this.priority = 0;
    if (data) {
      this.setData(data);
    }
  };
  /**
   * داده‌های اولیه را تعیین می‌کند.
   * @memberof PHandler
   * @param  {object} data داده‌ها
   * @return {PHandler}    دستگیره
   */
  pHandler.prototype.setData = function(data) {
    angular.extend(this, data);
    return this;
  };
  return pHandler;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PMenu
 * @description
 * یک منو در حقیقت یک فهرست از منو ایتم‌ها است که در نمایش‌ها به کار گرفته می‌شود. برنامه‌ها
 * می‌توانند منوهای مورد نظر خود را ثبت کرده و در در مکان‌های مورد نظر به کار ببرند. برای ایجاد
 * یک منو می‌توان به دو روش عمل کرد:
 *
 * - ایجاید یک نمونه از این موجودیت
 * - استفاده از سرویس $menu
 *
 * منوهای که به صورت مستقیم ایجاد بشن در سیستم مدیریت منوها ثبت نیستند و نمی‌شه مجدد از آنها
 * استفاده کرد. بهترین روش برای ایجاد یک منو استفاده از سرویس $menu است.
 *
 * @attr {PMenuItem} items فهرست تمام منوها و منوایتم‌هایی که توی این منو قرار دارند. این
 * خصوصیت یکی از مهم‌ترین خصوصیت‌های منو است.
 *
 * @attr {string[]} tags فهرستی از برچسب‌ها را تعیین می‌کند که به این منو داده می‌شود. از
 * این برچسب‌ها برای دسته بندی منوها استفاده می‌شود.
 *
 * @attr {integer} priority
 * اولویت این منو را تعیین می‌کند. در مواردی که نیاز است چندین منو با هم نمایش داده شوند از این
 * خصوصیت برای مرتب ساز آنها استفاده می‌شود.
 *
 * @example
 * <ul>
 * 	<li ng-repete="m in menu.items"
 * 		ng-click="m.active()"
 * 		ng-show="m.visible()">{{m.label}}</li>
 * </ul>
 */
.factory('PMenu', function() {
  var pMenu  = function(data) {
    this.priority = 0;
    this.tags = [];
    if (data) {
      this.setData(data);
    }
    this.items = [];
  };
  /**
   * داده‌های اولیه دستور را تعیین می‌کند.
   *
   * @memberof PMenu
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {PMenu}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pMenu.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * یک دستگیره جدید را به فهرست دستگیره‌های موجود در این دستور اضافه می‌کند.
   *
   * @memberof PMenu
   * @param  {PHandler} handler دستگیره جدید برای این دستور
   * @return {PMenu}   خود دستور به عنوان نتیجه برگردانده می‌شود.
   */
  pMenu.prototype.item = function(h){
    this.items.push(h);
    return this;
  };
  /**
   * یک برچسب جدید به منو اضافه می‌کند. مهم‌ترین کاربرد این برچسب‌ها فهرست کردن و نمایش دسته
   * بندی شده منوها است.
   *
   * @memberof PMenu
   * @param  {string} tag برچسب جدید
   * @return {PMenu}   خود دستور را به عنوان نتیجه برمی‌گرداند.
   */
  pMenu.prototype.tag = function(tag){
    this.tags.push(tag);
  };
  return pMenu;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc factory
 * @name PMenuItem
 * @description
 * این کلاس یک گزینه از منو را ایجاد می‌کند. هر منو ایتم شامل دو دسته اطلاعات می‌شود که یک دسته
 * برای نمایش و یک دسته برای اجرا است. داده‌هایی که برای نمایش به کار می‌روند محدودیت ندارند و
 * کاربر هر کلید و یا مقداری را می‌تواند برای آنها تعیین کند. اما داده‌های که برای اجرا به کار می‌روند
 * محدود بود و باید حتما مقادیر خاصی برای آنها تعیین شود.
 *
 * @tutorial menuitem-command
 */
.factory('PMenuItem', function($window, $act) {
  var pMenuItem  = function(data) {
    this.priority = 0;
    this.tags = [];
    if (data) {
      this.setData(data);
    }
  };
  /**
   * داده‌های اولیه دستور را تعیین می‌کند.
   *
   * @memberof PMenuItem
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {pCommand}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pMenuItem.prototype.setData = function(data) {
   if ('command' in data) {
     var scope = this;
     $act.getCommand(data.command).then(function(command) {
        angular.extend(scope, command);
        angular.extend(scope, data);
      });
   } else {
      angular.extend(this, data);
   }
   return this;
  };

  /**
   * یک برچسب جدید به فهرست برچسب‌های این ایتم اضافه می‌کند. این برچسب‌ها برای دسته بندی
   * کردن عمل‌ها در لایه نمایش کاربرد دارد.
   *
   * @memberof PMenuItem
   * @param  {string} tag برچسب جدید
   * @return {PCommand}   خود دستور را به عنوان نتیجه برمی‌گرداند.
   */
  pMenuItem.prototype.tag = function(tag){
    this.tags.push(tag);
  };

  /**
   * منو را فعال کرده و برنامه‌های معادل با آن را اجرا می‌کند. بر اساس اینکه توی منو چه داده‌هایی
   * قرار گرفته باشه، اجرا منو متفاوت هست. این فراخوانی به ترتیب داده‌های زیر را بررسی کرده و
   * در صورت موجود بودن اجرا می‌کند:
   *
   * - command
   * - actioin
   * - link
   *
   */
  pMenuItem.prototype.active = function() {
    if('command' in this){
      var args = [this.command];
      if (this.params instanceof Array) {
        args = args.concat(this.params);
      }
      return $act.execute.apply($act, args);
    } else if ('action' in this) {
      return this.action();
    } else if ('link' in this) {
      $window.location = this.link;
      return;
    }
    throw {status: 404, code:523, message:'Menu item is not supported'};
  };
  return pMenuItem;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc factory
 * @name PMessge
 * @description
 * یکی از سرویس‌هایی که در این بسته ارائه شده است، سیستم انتشار پیام است. این سیستم پیام‌های
 * کاربران دریافت و آنها را در قالب این کلاس منتشر می‌کند. این کلاس یک سری ابزارهای کاربردی
 * برای کار با این نوع پیام‌ها در اختیار سایر سیستم‌ها قرار می‌دهد.
 *
 */
.factory('PMessage', function() {
  var pMessage  = function(data) {
    if (data) {
      this.setData(data);
    }
  };
  /**
   * ساختار اولیه داده را در این کلاس ایجاد می‌کند.
   *
   * @memberof PMessage
   * @param  {object} data ساختار داده اولیه برای ایجاد دستور
   * @return {PMessage}  خود دستور به عنوان نتیجه برگردانده می‌ود.
   */
  pMessage.prototype.setData = function(data) {
   angular.extend(this, data);
   return this;
  };

  /**
   * تعیین می‌کند که آیا نوع پیام معمولی است
   * @memberof PMessage
   * @return {boolean} درستی در صورت که نوع پیام معمولی باشد.
   */
  pMessage.prototype.isInfo = function(){
    return this.type === 'info';
  };

  /**
   * تعیین می‌کند که نوع پیام رفع خطا است
   * @memberof PMessage
   * @return {boolean} درستی در صورتی که نوع پیام رفع خطا باشد
   */
  pMessage.prototype.isDebug = function(){
    return this.type === 'debug';
  };

  /**
   * تعیین می‌کند که ایا پیام از نوع اخطار است.
   * @memberof PMessage
   * @return {boolean} درستی در صورتی که نوع اخطار باشد
   */
  pMessage.prototype.isWarning = function(){
    return this.type === 'warning';
  };

  /**
   * تعیین می‌کند که آیا پیام از نوع خطا است
   * @memberof PMessage
   * @return {boolean} درستی اگر پیام یک خطا باشد
   */
  pMessage.prototype.isError = function(){
    return this.type === 'error';
  };

  return pMessage;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
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
.factory('PNamedContent', function ($http, $httpParamSerializerJQLike, $q,
	PObject){
	var pNamedContent = function() {
		PObject.apply(this, arguments);
	};
	pNamedContent.prototype = new PObject();
	/**
	 * محتوی نامدار را به روز می‌کند.
	 * @memberof PNamedContent
	 * @return {promise} محتوی جدید
	 */
	pNamedContent.prototype.update = function(){
		// XXX: maso, 1395: به روز کردن صفحه
	};

	/**
	 * محتوی نامدار را از سیستم حذف می‌‌کند.
	 *
	 * @memberof PNamedContent
	 * @return {promise} محتوی حذف شده
	 */
	pNamedContent.prototype.remove = function(){
		// XXX: maso, 1395: حذف صفحه
	};
	// // XXX: maso, 1395: تعیین محتوی
	// pNamedContent.prototype.content = function(){
	// 	var deferred = $q.defer();
	// 	deferred.resolve(new PContent({id:2}));
	// 	return deferred.promise;
	// }
	/**
	 * محتوی این صفحه نامدار را تعیین می‌کند. این فراخوانی زمانیکه محتوی به صورت یم مقدار
	 * رشته‌ای و یا یک ساختار داده‌ای است بسیار مناسب است.
	 *
	 * @memberof PNamedContent
	 * @return {object} محتوی صفحه
	 */
	pNamedContent.prototype.value = function(){
		return this.content.value();
	};

	/**
	 * مقدار جدیدی را برای این محتوی نامدار تعیین می‌کند.
	 * @memberof PNamedContent
	 * @param  {object} v محتوی جدید
	 * @return {promise}   محتوی به روز شده
	 */
	pNamedContent.prototype.setValue = function(v){
		return this.content.setValue(v);
	};
	return pNamedContent;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')
/**
	* @memberof pluf
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
	};
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
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @name PaginatorPage
 * @ngdoc factory
 * @memberof pluf
 * @description ساختار داده‌ای را تعیین می‌کند که در صفحه بندی داده‌ها به کار
 *              گرفته می‌شود. تمام داده‌های که از سرور ارسال می‌شود به صورت صفحه
 *              بندی است و تعداد آنها محدود است. این داده‌ها با این ساختار
 *              داده‌ای در اختیار کاربران قرار می‌گیرد.
 */
.factory('PaginatorPage', function(PObject) {
	var paginatorPage = function() {
		PObject.apply(this, arguments);
	};
	paginatorPage.prototype = new PObject();
	/**
	 * تعیین می‌کند که آیا تعداد بیشتری صفحه وجود دارد یا اینکه به انتهای این
	 * صفحه‌ها رسیدیم
	 * 
	 * @memberof PaginatorPage
	 * @return {boolean} وجود صفحه بیشتر
	 */
	paginatorPage.prototype.hasMore = function() {
		return (this.current_page < this.page_number);
	};
	/**
	 * تعیین اینکه صفحه اول هستیم
	 * 
	 * @memberof PaginatorPage
	 * @return {boolean} صفحه اول بودن
	 */
	paginatorPage.prototype.isFirst = function() {
		return this.current_page === 1;
	};
	paginatorPage.prototype.next = function() {
		return this.current_page + 1;
	};
	paginatorPage.prototype.previous = function() {
		return this.current_page - 1;
	};
	return paginatorPage;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PaginatorParameter
 * @description
 * بسیاری از داده‌هایی که در سیستم موجود است به صورت صفحه بندی شده در اختیار کاربران قرار
 * می‌گیرد. در این بخش ابزارهایی برای کار با صفحه بندی ارائه شده است.
 *
 *
 * از جمله خصوصیاتی که می‌توان در این ساختار قرار داد عبارتند از:
 *
 * @attr {string} _px_q متن مورد جستجو در فیلدهای مختلف
 * @attr {Integer} _px_p  شماره صفحه مورد نظر از فهرست صفحه‌بندی شده
 * @attr {Integer} _px_ps  تعداد آیتم‌های موجود در هر صفحه
 * @attr {string} _px_fk نام خصوصیتی که برای فیلتر کردن مورد استفاده قرار می‌گیرد
 * @attr {string} _px_fv مقداری مورد نظر برای خصوصیتی که بر اساس آن فیلتر انجام می‌شود.
 * @attr {string} _px_sk نام خصوصیتی که فهرست باید بر اساس آن مرتب شود.
 * @attr {string} _px_so ترتیب مرتب‌سازی، اینکه مرتب‌سازی به صورت صعودی باشد یا نزولی
 *
 */
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
			this.param._px_c = $size;
			return this;
		},
		setQuery : function($query) {
			this.param._px_q = $query;
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
			this.param._px_p = $page;
			return this;
		},
		nextPage: function(){
			this.param._px_p +=1;
			return this;
		},

		setOrder : function($key, $order) {
			this.param._px_sk = $key;
			this.param._px_so = $order;
			return this;
		},
		setFilter : function($key, $value) {
			this.param._px_fk = $key;
			this.param._px_fv = $value;
			return this;
		},
		getParameter : function() {
			return this.param;
		}

	};
	return pagParam;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
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
.factory('PPreferenceNode', function(PObject, $q, $timeout) {
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
		// var scope = this;
		$timeout(function() {
			// var node = new PPreferenceNode();
			// scope.children[n] = node;
			// def.resolve(node);
			def.reject(n);
			//XXX: maso, 1395: ذخیره کرده تنظیم‌های جدید
		}, 1);
		return def.promise;
	};
	/**
	 * گره تعیین شده با نام را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof PPreferenceNode
	 * @param  {String} n نام گره مورد نظر
	 * @return {PaginatorPage(PPreferenceNode)}  زیرگره معادل
	 */
	pPreferenceNode.prototype.node = function() {
		//XXX: maso, 1395: از بین بچه‌ها گره مناسب را پیدا کرده و به عنو نتیجه برمی‌گرداند
	};
	/**
	 * تمام زیر گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد.
	 * @memberof PPreferenceNode
	 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}   گره‌ها به صورت صفحه بندی شده.
	 */
	pPreferenceNode.prototype.nodes = function() {
		//XXX: maso, 1395:
	};
	/**
	 * گره پدر را تعیین می‌کند.
	 * @memberof PPreferenceNode
	 * @return {promise(PPreferenceNode)} یک دستگیره برای انجام کار
	 */
	pPreferenceNode.prototype.parent = function() {
		//XXX: maso, 1395:
	};
	return pPreferenceNode;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
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
	 * @param {Object} newValue مقدار جدید
	 */
	pPreferenceProperty.prototype.setValue = function(){};
	/**
	 * مقدار خصوصیت را تعیین می‌:کند.
	 * @return {Object} مقدار خصوصیت
	 */
	pPreferenceProperty.prototype.value = function(){};
	return pPreferenceProperty;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc factory
 * @name PProcess
 * @description
 * حالت را در سیستم ایجاد می‌کند از این کلاس برای تعیین حالت بخش‌های متفاوتی از
 * سیستم استفاده می‌شود که ممکن است به صورت پویا تغییر کنند.
 *
 * میزان پیشرفت کار درحقیقت یک مانیتور است که اطلاعاتی راجع به فرآنید انجام کار
 * را تعیین می‌کند. در اینجا موارد زیر برای یک حالت در نظر گرفته شده است:
 *
 * @attr {Integer} id شناسه این پردازش را تعیین می‌کند. تمام پردازش‌هایی که به صورت محلی
 * ایجاد می‌شوند این شناسه را ندارند.
 *
 * @attr {string[]} tags فهرستی از برچسب‌ها را تعیین می‌کند که برای این پردازش در نظر
 * گرفته شده است. هر تگ با استفاده از یک رشته معمولی تعیین می‌شود.
 *
 * @attr {string} progress.taskName عنوان یک وظیفه را تعیین می‌کند.
 *
 * @attr {string} progress.subTask عنوان هر زیر وظیفه را تعیین می‌کند.
 *
 * @attr {string} progress.totalWork تعداد کل کارهایی را تعیین می‌کند که باید انجام شود.
 * در صورتی که مقدار منفی یا صفر باری این متغییر تعیین شود به معنی کاری خواهد بود که نمی‌توان
 * برای آن تخمینی از مراحل کار داشت.
 *
 * @attr {string} progress.worked تعداد کارهایی را تعیین می‌کند که تا حالا انجام شده است
 *
 * @attr {string} progress.status حالت پایان یک کار را تعیین می‌کند. در صورتی که این
 * مقدار تهی باشد به این معنی است که هنوز کار تمام نشده و در حال انجام است.
 *
 * @attr {string} progress.status.severity شدت پایان کار را تعیین می‌کند. این شدت با
 * یه سری عدد ثابت تعیین می‌شود که به صورت ثابت در کلاس تعریف شده است. این شدت در
 * عمل حالت اصلی را تعیین می‌کند. برای نمونه حالت موفقیت یا حالت خطا.
 *
 * @attr {string} progress.status.code کد حالت پایان را تعیین می‌کند. این کد تعریف نشده
 * است و در هر نرم افزار ممکن است معنی خاصی داشته باشد.
 *
 * @attr {string} progress.status.message پیام پایان کار را تعیین می‌کند.
 *
 *
 * @example
 *  // Start
 *  PProcess process = new PProcess();
 *  // Init
 *  process.setTask("task name")
 *  	.setTotalWork(10)
 *  	.setWorked(0);
 *  var i = 0;
 *  for(i = 0; i < 10; i++){
 *  	//Do something
 *  	monitor
 *  		.setWorked(i)
 *  		.setSubTask('Sub task title:'+i);
 *  }
 *  monitor
 *  	.setStatus({
 *  		severity: PProcess.OK,
 *  		code: 1,
 *  		message: 'job complit'
 *  	});
 *
 * @example
 * <div ng-hide="process.status">
 * 	<h2>Process is running</h2>
 * 	<h1>{ {process.taskName()} }</h1>
 * 	<h4>{ {process.subTask()} }</h1>
 * 	<p>{ {process.percentage()} }</p>
 * </div>
 * <div ng-show="process.status">
 * 	<h2>Process is running</h2>
 * 	<h3>{ {process.status.severity} }</h3>
 * 	<h3>{ {process.status.code} }</h3>
 * 	<h3>{ {process.status.message} }</h3>
 * </div>
 */
.factory('PProcess', function(PObject) {
	var pProcess = function() {
		PObject.apply(this, arguments);
		if(!this.progress){
			this.progress = {};
		}
	};

	/**
	 * این ثابت حالت پایانی موفق را تعیین می‌کند. این ثابت به عنوان شدت برای حالت پایانی در
	 * نظر گرفته می‌شود.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.OK = 0;

	/**
	 * حالت پایانی پیام را تعیین می‌کند. در این حالت کار تمام شده ولی یک پیام برای کاربرا وجود
	 * دارد.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.INFO = 1;

	/**
	 * حالت پایانی اخطار را تعیین می‌کند. در این حالت کار با مشکلاتی روبرو بوده و پیام ارسال
	 * شده برای کاربر این موضوع را تعیین می‌کند.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.WARNING = 2;

	/**
	 * حالت پایانی خطا را تعیین می‌کند. در این حالت کار نتوانسته با موفقیت انجام شود. پیامی نیز
	 * تعیین شده که بیان کننده خطا ایجاد شده در انجام این پردازش است.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.ERROR = 4;

	/**
	 * حالت پایانی منحل شدن پیام را تعیین می‌کند. این حالتی است که کاربر پردازش را منحل کرده
	 * و سیستم در انجام آن تاثیری نداشته.
	 * @memberof PProcess
	 * @type {Number}
	 */
	pProcess.prototype.CANCEL = 8;

	/**
	 * تعداد کل کارهایی که تا حال انجام شده را تعیین می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} w تعداد کل کارها
	 * @return {PProgressMonitor}   خود پیشرفت کار را به عنوان خروجی برمی‌گرداند
	 */
	pProcess.prototype.setWorked = function(w) {
		this.progress.worked = w;
		return this;
	};

	/**
	 * اندازه کارهایی که انجام شده است را تعیین می‌کند.
	 * @memberof PProcess
	 * @return {Integer} اندازه کارهایی که انجام شده است
	 */
	pProcess.prototype.worked = function() {
		return this.progress.worked;
	};

	/**
	 * به میزان کار انجام شده یک تعداد ثابت اضافه می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} w تعداد کار انجام شده جدید
	 * @return {PProgressMonitor}   خود ساختار داده‌ای پیشرفت کار
	 */
	pProcess.prototype.addWorked = function(w) {
		if (this.progress.worked) {
			this.progress.worked += w;
		} else {
			this.progress.worked = w;
		}
		return this;
	};

	/**
	 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
	 * @memberof PProcess
	 * @param  {Integer} tw تعداد کل کارهایی که باید انجام شود.
	 * @return {PProgressMonitor}  خود ساختار داده‌ای پیشرفت کار.
	 */
	pProcess.prototype.setTotalWork = function(tw) {
		this.progress.totalWorked = tw;
		return this;
	};

	/**
	 * تعداد کل کارهایی که باید انجام شود را تعیین می‌کند.
	 * @memberof PProcess
	 * @return {Integer} تعداد کل کارها
	 */
	pProcess.prototype.totalWork = function() {
		return this.progress.totalWorked;
	};

	/**
	 * میزان پیشرفت کار را به درصد تعیین می‌کند. این مقدار با روش ساده تقسم به دست می‌آیدکه
	 * از رابطه زیر پیروی می‌کند:
	 *
	 * P = worked / totalWork * 100
	 *
	 * در صورتی که مقادیر اشتباهی برای تعداد کل کارها و کارهای انجام شده تعیین شده باشد مقدار
	 * -۱ به عنوان نتیجه برگردانده خواهد شد.
	 * @memberof PProcess
	 * @return {Number} درصد پیشرفت کار
	 */
	pProcess.prototype.percentage = function() {
		if(this.progress.totalWorked <= 0){
			return 0;
		}
		return this.progress.worked * 100 / this.progress.worked;
	};

	/**
	 * عنوان کار اصلی را تعیین می‌کند. این عنوان در نمایش به کار گرفته می‌شود.
	 * @memberof PProcess
	 * @param  {String} t عنوان اصلی کار
	 * @return {PProgressMonitor}  خود ساختار داده‌ای
	 */
	pProcess.prototype.setTaskName = function(t) {
		this.progress.taskName = t;
		return this;
	};

	/**
	 * عنوان وظیفه را تعیین می‌کند
	 * @memberof PProcess
	 * @return {string} عنوان وظیفه
	 */
	pProcess.prototype.taskName = function() {
		return this.progress.taskName;
	};

	/**
	 * عنوان کار جاری را تعیین می‌کند. در این مدل فرض کرده‌ایم که هر کار از چندین زیر وظیفه
	 * تشکیل می‌شود که در دوره‌های زمانی به صورت پشت سر هم انجام می‌شوند.
	 * @memberof PProcess
	 * @param  {String} st عنوان زیر وظیفه
	 * @return {PProcess}    خود ساختار داده‌ای پیشرفت کار.
	 */
	pProcess.prototype.setSubTask = function(st) {
		this.progress.subTask = st;
		return this;
	};

	/**
	 * عنوان زیر وظیفه‌ای را تعیین می‌کند که در حال اجرا است.
	 * @memberof PProcess
	 * @return {string} عنوان زیر وظیفه
	 */
	pProcess.prototype.subTask = function(){
		return this.progress.subTask;
	};

	return pProcess;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')


/**
 * @ngdoc factory
 * @name PProfile
 * @memberof pluf
 * 
 * @description
 * هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری اطلاعات کلی می‌شود.
 * این اطلاعات برای هر نرم افزار می‌تواند متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل
 * دارید که شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره دانشجویی
 * است.
 *
 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید مقدار باشد
 * که شما می‌توانید مقادیر مورد نظر خود را در آن اضافه و کم کنید.
 * 
 * @attr {Integer} id شناسه
 * @attr {Integer} user شناسه حساب کاربری مربوط به این پروفایل
 * @attr {Boolean} validate وضعیت اعتبار پروفایل
 * @attr {String} country کشور
 * @attr {String} city شهر
 * @attr {String} address آدرس
 * @attr {String} postal_code کد پستی
 * @attr {String} phone_number شماره تلفن
 * @attr {String} mobile_number شماره موبایل
 * @attr {String} national_id کد ملی
 * @attr {String} shaba شماره شبای بانکی
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد پروفایل
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory('PProfile', function( $http, $httpParamSerializerJQLike, $q, PObject) {
	/*
	 * یک نمونه جدید از این موجودیت ایجاد می کند.
	 */
	var pProfile = function(data) {
		if(data){
			this.setData(data);
		}
	};
	
	pProfile.prototype = new PObject();

	/**
	 * تغییرهای اعمال شده در ساختار داده‌ای پروفایل کاربری را به سرور انتقال می‌دهد.
	 * تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در این ساختار داده‌ای تنها
	 * در برنامه کاربر خواهد بود و با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد
	 *
	 * @memberof PProfile
	 * 
	 * @return {promise(PProfile)} ساختار داده‌ای پرفایل کاربری
	 */
	pProfile.prototype.update = function() {
		if (this.user.isAnonymous()) {
			var deferred = $q.defer();
			deferred.reject();
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/'+ this.user.id + '/profile',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};
	
	/**
	 * پروفایل کاربری را حذف می کند
	 * 
	 * @memberof PProfile
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری حذف شده
	 */
	pProfile.prototype.remove = function(){
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/user/' + this.user + '/profile',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data){
			scope.setData(data.data);
			return scope;
		});
	};
	
	return pProfile;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @ngdoc factory
 * @name PUser
 * @memberof pluf
 * 
 * @description
 * ساختار داده‌ای یک کاربر را در سیستم تعیین می‌کند. از این مدل برای مدیریت کردن اطلاعات کاربری استفاده
 * می‌شود.
 *
 * @attr {Integer} id شناسه
 * @attr {String} login نام کاربری به منظور لاگین کردن
 * @attr {String} password کلمه عبور کاربر برای لاگین کردن
 * @attr {String} first_name نام کاربر
 * @attr {String} last_name نام خانوادگی کاربر
 * @attr {String} email آدرس ایمیل کاربر
 * @attr {String} language زبان پیش‌فرض کاربر
 * @attr {String} timezone منطقه زمانی کاربر
 * @attr {Datetime} date_joined تاریخ و زمان ایجاد حساب
 * @attr {Datetime} last_login تاریخ و زمان آخرین لاگین
 * @attr {Boolean} administrator تعیین می‌کند که آیا این کاربر دسترسی ادمین دارد یا نه
 * @attr {Boolean} staff تعیین می‌کند که این کاربر دسترسی staff دارد یا نه 
 *
 * از این موجودیت برای مدیریت (ایجاد، ویرایش و حذف) حساب کاربری استفاده می‌شود.
 * برای نمونه فرض کنید که می‌خواهیم نام یک کاربر را تغییر دهیم، برای این کار کد زیر باید استفاده
 * شود:
 *
 * <pre><code>
 * 	var user;
 * 	...
 * 	user.first_name = 'new first name';
 * 	user.update().then(function(){
 * 		// user account is updated
 * 	});
 * </code></pre>
 *
 * نکته: در صورتی که خصوصیت گذرواژه کاربری را تغییر دهید، این تغییر در سرور اعمال خواهد
 * شد.
 */
.factory('PUser', function($http, $q, $httpParamSerializerJQLike, PObject, PProfile) {
	
	var pUser = function(data) {
		if(data){
			this.setData(data);
		}
	};
	
	pUser.prototype = new PObject();

	/**
	 * اطلاعات حساب کاربری را به‌روزرسانی می‌کند
	 * 
	 * تغییراتی که در ساختارهای داده‌ای اعمال شده است را در سرور نیز اعمال می‌کند.
	 * تا زمانی که این فراخوانی انجام نشود، تمام تغییرهای اعمال شده در این ساختار داده‌ای تنها
	 * در برنامه کاربر خواهد بود و با بارگذاری دوباره سیستم، به حالت اولیه برگردانده خواهد شد.
	 *
	 * @memberof PUser
	 * 
	 * @return {promise(PUser)} ساختار داده‌ای به‌روز شده‌ی حساب کاربری
	 */
	pUser.prototype.update = function() {
		var scope = this;
		return $http({
			method : 'POST',
			url : '/api/user/' + this.id + '/account',
			data : $httpParamSerializerJQLike(scope),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
			return scope;
		});
	};
	
	/**
	 * حساب کاربری را حذف می‌کند
	 * 
	 * @memberof PUser
	 * 
	 * @return {promise(PUser)} ساختار داده‌ای حساب کاربری حذف شده
	 */
	pUser.prototype.remove = function() {
		var scope = this;
		return $http({
			method : 'DELETE',
			url : '/api/user/' + this.id + '/account',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(data) {
			scope.setData(data.data);
			return scope;
		});
	};

	/**
	 * پروفایل کاربر را تعیین می‌کند.
	 *
	 * @memberof PUser
	 * 
	 * @returns {promise(PProfile)} ساختار داده‌ای پروفایل کاربری مربوط به این حساب کاربری
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
		});
	};

	/**
	 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی به صورت هم زمان انجام
	 * می‌شود.
	 *
	 * @memberof PUser
	 * 
	 * @return {boolean} حالت مدیر بودن کاربر
	 */
	pUser.prototype.isAdministrator = function() {
		return (this.id && this.id > 0 && this.administrator);
	};
	
	/**
	 * تعیین می‌کند که آیا کاربر جاری staff است یا نه. 
	 * این فراخوانی به صورت هم زمان انجام می‌شود.
	 *
	 * @memberof PUser
	 * 
	 * @return {boolean} حالت staff بودن کاربر
	 */
	pUser.prototype.isStaff = function() {
		return (this.id && this.id > 0 && this.staff);
	};
	
	
	return pUser;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $act
 * @description
 * 
 * در این مدل دو مفهوم کلی تعریف می‌شود که عبارتند از دستور و دستگیره. دستور یک
 * عبارت رشته‌ای است که یک عمل مجازی را تعیین می‌کند و دستگیره عملی است که در
 * مقابل هر دستور اجرا می‌شود. برای نمونه فرض کنید که یک دستور ورود به سیستم
 * وجود دارد که نام آن به صورت زیر تعیین شده است:
 * 
 * user.login
 * 
 * فراخوانی این دستور منجر به اجرا شدن تمام دستگیره‌هایی مرتبط خواهد شد. تعریف
 * این دستور و دستیگره‌های آن در نمونه‌های زیر اورده شده است.
 * 
 * @example
 * 
 * <pre><code>
 * $act.command({
 * 	id: 'user.login',
 * 	label: 'login',
 * 	icon: 'enter',
 * 	tags: ['user', 'login']
 * });
 * ...
 * $act.handler({
 * 	command: 'user.login',
 * 	handle: function(credential){
 * 		return $usr.login(credential);
 * 	}
 * });
 * </code></pre>
 * 
 * @example
 * 
 * <pre><code>
 * // اجرای دستور
 * $act.execute('user.login', {
 * 	login : 'admin',
 * 	password : 'admin'
 * });
 * </code></pre>
 */
.service('$act', function($q, $timeout, PCommand, PHandler) {
	/*
	 * فهرستی از تمام دستورهای تعریف شده را نگهداری می ‌کند
	 */
	this._commands = [];

	/**
	 * دستور معادل با شناسه ورودی را تعیین می‌کند. در صورتی که دستور معادل وجود
	 * نداشته باشد یک خطا صادر خواهد شد.
	 * 
	 * @memberof $act
	 * @param {string}
	 *            id شناسه دستور را تعیین می‌کند.
	 * @return {promise(PCommand)} [description]
	 */
	this.getCommand = function(id) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			if (id in scope._commands) {
				def.resolve(scope._commands[id]);
				return;
			}
			def.reject({
				status : 404,
				code : 10,
				message : 'command not found'
			});
		}, 1);
		return def.promise;
	};

	/**
	 * یک دستور جدید به سیستم اضافه می‌کند. در صورتی که دستوری با شناسه دستور
	 * قبلا در سیستم موجود باشد، دستور جدید با مورد قبل جایگزین خواهد شد.
	 * 
	 * @param {Object}
	 *            command یک ساختار داده‌ای که پارامترهای دستور را تعیین می‌‌کند
	 * @return {$act} ساختار داده‌ای دستور
	 */
	this.command = function(cmdData) {
		// دستور باید شناسه داشته باشد
		if (!cmdData.id) {
			// TODO: maso, 1395: پیام مناسبی برای خطا ایجاد شود.
			throw {
				status : 404,
				code : 11,
				message : 'Command id is empty'
			};
		}
		var cmd;
		if (cmdData.id in this._commands) {
			// TODO: maso, 1395: یه پیام اخطار که پیام وجود داشته
			cmd = this._commands[cmdData.id];
			cmd.setData(cmdData);
		} else {
			cmd = new PCommand(cmdData);
			this._commands[cmd.id] = cmd;
		}
		return this;
	};

	/**
	 * یک دستگیریه را به فهرست دستگیره‌های یک دستور اضافه می‌کند.
	 * 
	 * @param {object}
	 *            ساختار داده‌ای که یک دستیگره را توصیف می‌کند.
	 * @return {$act} خود سیستم مدیریت دستورها را برمی‌گرداند
	 */
	this.handler = function(handData) {
		var cmd;
		if (handData.command in this._commands) {
			cmd = this._commands[handData.command];
		} else {
			cmd = new PCommand({
				id : handData.command
			});
			this._commands[cmd.id] = cmd;
		}
		cmd.handler(new PHandler(handData));
		return this;
	};

	/**
	 * یک دستور را به صورت غیر همزمان اجرا می‌کند. اجرای دستور معادل با این است
	 * که تمام دستگیره‌های ان به ترتیب اجرا شوند. امکان ارسال پارامتر به تمام
	 * دستگیره‌ها وجود دارد. برای این کار کافی است که پارامترهای اضافه را بعد از
	 * پارامتر دستور وارد کنید. برای نمونه فرض کنید که دستور ورود کاربر به صورت
	 * زیر تعریف شده است:
	 * 
	 * <pre>
	 * &lt;command&gt;
	 * 	$act.command({
	 * 		id: 'user.login',
	 * 		label: 'login'
	 * 	}).handler({
	 * 		command: 'user.login',
	 * 		handle: function(credential){
	 * 			// Do something
	 * 		}
	 * 	})
	 * &lt;/command&gt;
	 * </pre>
	 * 
	 * در این صورت به سادگی می‌توان این دستور را به صورت زیر فراخوانی کرد:
	 * 
	 * <pre>
	 * &lt;command&gt;
	 * 	$act.execute('user.login',{
	 * 		login: 'user login',
	 * 		password: 'user password'
	 * 	});
	 * &lt;/command&gt;
	 * </pre>
	 * 
	 * @memberof $act
	 * @param {string}
	 *            command دستور
	 * @return {promise} نتیجه اجرای دستورها
	 */
	this.execute = function(command) {
		var def = $q.defer();
		// اجرای یک دستور
		if (command in this._commands) {
			var scope = this;
			var args = Array.prototype.slice.call(arguments).slice(1);
			$timeout(function() {
				var cmd = scope._commands[command];
				cmd.handlers.forEach(function(handler) {
					handler.handle.apply(handler, args);
				});
				def.resolve();
			}, 1);
			return def.promise;
		}

		/*
		 * اجرا یک عمل
		 * 
		 * یک عمل ساختار داده‌ای است که در آن خصوصیت‌هایی برای تعیین مدل اجرا
		 * تعیین شده است. مثلا یک مدل عمل به صورت زیر قابل تعریف است:
		 * 
		 * <pre> <code> var action1={ lable: 'label', text: 'this is an example
		 * action', type: 'command', value: 'user.logout' }; </code> </pre>
		 * 
		 * <ul> <li>command</li> <li>link</li> <li>state</li> </ul>
		 */
		// XXX: maso, 1395: اجرای این مدل عمل‌ها باید اضافه شود
		// خطای یافت نشدن دستور
		def.reject({
			message : 'Command not found :' + command,
			statuse : 400,
			code : 4404
		});
		return def.promise;
	};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular .module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $cms
 * 
 * @description
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
.service('$cms',function($http, $httpParamSerializerJQLike, $q, $timeout,
	PContent, PNamedContent, PaginatorPage, PException) {
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
				page.items.push(
					scope._retc(res.data.items[i].id, res.data.items[i])
				);
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
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc service
 * @name $menu
 * @description
 * معمولا توی برنامه‌های گرافیکی نیاز دارید دسته‌ای از عمل‌های و دستورها را به صورت یک منو نمایش
 * بدید. برای نمونه نوار ابزاری که بالای یک صفحه میاد یک نمونه از منوهایی است که توی نرم افزارها
 * استفاده می‌شه. یا اینکه منوهای کشویی که از سمت راست و یا چپ صفحه نمایش داده می‌شن هم
 * از این نمونه‌ها هستن.
 *
 * بدترین راه حل این هست که هرجا لازم داشتیم یک فهرست از عمل‌ها رو ایجاد کنیم و توی نمایش قرار
 * بدیم اما این کار مشکل‌هایی  اساسی داره که عبارتند از:
 *
 * - کدهایی با یک کارکرد توی سیستم تکرار می‌شن و مدیریتش مشکل می‌شه
 * - لایه نمایش پیچیده می‌شه
 * - تست عمل‌های اضافه شده مشکل می‌شه
 *
 * نمی‌خوام بگم که بهترین راه حل اینکه بیایم تمام عمل‌ها بزاریم توی یه لیست و این لیست رو هرجایی
 * استفاده کنیم. ولی حداقل این هست که می‌تونیم کارهای پر کاربرد رو به صورت متمرکز تعریف کنیم و
 * از هرجایی استفاده کنیم. توی سیستم مثل اکلیپس از این تکنیک استفاده شده و ما هم اینجا استفاده
 * کردیم.
 *
 * روال کلی این هست که دسته‌ای از دستورها و عمل‌های دلخواه رو با یک کلید به عنوان منو ذخیره
 * می‌کنید و هرجایی که لازم داشتید این منو رو نمایش میدید. یکی از مهم‌ترین کارهایی که می‌تونید
 * استفاده کنید دستورهایی مثل ورود و خروج کاربر هست.
 *
 * با این کار هر کنترولی از سیستم می‌تونه یه سری دستور جدید به منو اضافه کن و با بزرگ شدن نرم افزار
 * این منو هم به صورت خودکار رشد خواهد کرد. نکته اینکه دستورها رو تو خود کنترولها اضافه نکنید مخصوصا
 * زمانی که از مدلهای ng-route استفاده می‌کنید.
 *
 * @example
 * // Create header menu in app
 * angular.module('myApp')
 * 	.run(function($menu){
 * 		$menu.addItem('header', {
 * 			command: 'usr.login'
 * 		}).addItem('header', {
 * 			command: 'logout'
 * 		});
 * 	});
 *
 * @example
 * // Assigne header menu into scope variable
 * angular.module('myApp').controller('SidebarController', function($scope, $menu){
 * 	$menu.menu('header').then(function(menu){
 * 		$scope.menu = menu;
 * 	})
 * });
 *
 * @example
 * <!-- Show all action in menu -->
 * <ul>
 * 	<li ng-repeat="m in menu.items"
 * 			ng-show="m.visible">{{m.label}}</li>
 * </ul>
 */
.service('$menu', function($q, $timeout, PMenu, PMenuItem) {
	/**
	 * مخزنی از تمام منوها ایجاد می‌کند. این مخزن می‌تواند به صورت مستقیم در سایر نمایش‌ها و سرویس‌ها
	 * استفاده شود.
	 *
	 * @type {Array}
	 */
	this.menus = [];

	/*
	 * یک منوایتم رو به منوهای موجود اضافه می‌کند. در صورتی که منو معادل وجود نداشته باشد یک نمونه
	 * جدید برای آن ایجاد خواهد کردم.
	 */
	this._addMenu = function(id, menu) {
		if (!(id in this.menus)) {
			this.menus[id] = new PMenu({'id': id});
		}
		this.menus[id].item(menu);
	};

	/**
	 * یک منو را با شناسه تعیین شده بازیابی می‌کند. در صورتی که منو با شناسه در مورد نظر موجود
	 * نباشد یک نمونه برای آن ایجاد شده و به عنوان نتیجه برگردانده می‌شود.
	 *
	 * @memberof $menu
	 * @param  {string} id شناسه منو مورد نظر
	 * @return {promise(PMenu)} منوی ایجاد شده
	 */
	this.menu = function(id) {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			if (!(id in scope.menus)) {
				scope.menus[id] = new PMenu({'id':id});
			}
			def.resolve(scope.menus[id]);
		}, 1);
		return def.promise;
	};

	/**
	 * یک گزینه جدید به منو اضافه می‌کند. این روش اضافه کردن منو کلی است و همواره یک منوایتم
	 * به عنوان گزینه جدید اضافه خواهد شد.
	 *
	 * @memberof $menu
	 * @param {string} شناسه منو مورد نظر
	 * @param {object} داده‌های مورد نیاز برای ایجاد منوایتم
	 */
	this.addItem = function(id, menu) {
		this._addMenu(id, new PMenuItem(menu));
		return this;
	};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')


/**
 * @memberof pluf
 * @ngdoc service
 * @name $notify
 * @description
 * تمام سیستم‌های گرافیکی نیاز به اعلام هشدار و یا پیام‌هایی به کاربران هستند. یکی از راه‌های مناسب
 * برای انجام این کار استفاده از سیستم هشدار است. این سرویس توسط بخش‌های متفاوت گرافیکی
 * شنود می‌شود و با صدور یک پیام، آن را به کاربران نشان می‌دهد.
 *
 * ساختار داده‌ای در نظر گرفته شده برای پیام‌ها کاملا باز است و کاربران می‌توانند هر ساختار داده‌ای را
 * به عنوان پیام ارسال کنند. به صورت پیش فرض ساختاری مانند ساختار زیر به عنوان یک پیام در نظر
 * گرفته می‌شود:
 *
 * <pre><code>
 * {
 * 	title: 'message title',
 * 	message: 'message body',
 * 	action: function(){
 * 		// Message action
 * 	}
 * }
 * </code></pre>
 *
 * این که در سیستم‌های نرم‌افزاری این پیام دقیقا چطور نمایش داده می‌شود کاملا وابسطه به واسط گرافیکی
 * است و طراح گرافیکی در این زمینه کاملا آزاد است. در ادامه دسته‌ای از نمونه‌ها برای استفاده از این
 * سرویس آورده شده است.
 *
 * @example
 * //add info
 * $notify.info({
 * 	title: 'my title',
 * 	message: 'my message'
 * })
 *
 * @example
 * //add error
 * $notify.error({
 * 	title: 'network error',
 * 	message: 'network is not reachable. click to retry',
 * 	action: function(){
 * 		// Trye to reconnect
 * 	}
 * })
 *
 * @example
 * $notify.onMessage(function(message){
 * 	// message is instanceof PMessage
 * 	openDialot(message);
 * })
 */
.service('$notify', function($rootScope, $timeout, $q, PMessage) {
	/*
	 * فهرست شنودگرهای
	 */
	this._listeners = [];
	this._fire = function(list, m) {
		var deferred = $q.defer();
		var ms= [];
		ms.push(new PMessage(m));
		$timeout(function() {
			for (var i = 0; i < list.length; i++) {
				list[i].apply(list[i], ms);
			}
			deferred.resolve();
		}, 10);
		return deferred.promise;
	};
	/**
	 * یک شنودگر جدید را به فهرست تمام شنودگرها اضافه می‌کند. در صورتی که پیامی در سیستم منتشر
	 * این شنودگر اجرا خواهد شد.
	 * @memberof $notify
	 * @param  {function} listener متدی که باید اجرا شود.
	 * @return {$notify}   خود سرویس
	 */
	this.onMessage = function(l) {
		this._listeners.push(l);
		return this;
	};
	/**
	 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
	 * @memberof $notify
	 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
	 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
	 */
	this.info = function(message) {
		message.type= 'info';
		return this._fire(this._listeners, message);
	};

	/**
	 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
	 * @memberof $notify
	 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
	 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
	 */
	this.warning = function(message) {
		message.type= 'warning';
		return this._fire(this._listeners, message);
	};

	/**
	 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
	 * @memberof $notify
	 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
	 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
	 */
	this.debug = function(message) {
		message.type= 'debug';
		return this._fire(this._listeners, message);
	};

	/**
	 * یک پیام را به عنوان یک خبر معمولی در سیستم منتشر می‌کند.
	 * @memberof $notify
	 * @param  {PMessage} message یک پیام معمولی را تعیین می‌کند.
	 * @return {promise()}      دستگیره‌ای برای اجرای تمام شنودگرها
	 */
	this.error = function(message) {
		message.type= 'error';
		return this._fire(this._listeners, message);
	};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $preference
 * @description
 * مدیریت داده‌های محلی کاربر را انجام می‌دهد. این داده‌ها به صورت محلی در
 * مرورگر ذخیره سازی می‌شوند.‌
 */
 .service('$preference', function() {
	/**
	 * یک گره با نام جدید ایجاد می‌کند
	 * @memberof $preference
	 * @param  {String} nodeName نام گره
	 * @return {promise(PPreferenceNode)}   دستگیره گره جدید
	 */
	this.newNode = function() {};
	/**
	 * گره با مسیر تعیین شده را پیدا کرده و به عنوان نتیجه برمی‌گرداند
	 * @memberof $preference
	 * @param  {String} path گره تنظیم‌ها
	 * @return {promise(PPreferenceNode)}     گره مورد نظر
	 */
	this.node = function() {};
	/**
	 * فهرست همه گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد
	 * @memberof $preference
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای صفحه بندی
	 * @return {promise(PaginatorPage)}  دستگیره فهرست گره‌ها
	 */
	this.nodes = function() {};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')

/**
 * @memberof pluf
 * @ngdoc service
 * @name $process
 * @description
 * روی سرور دسته‌ای از پردازش‌ها در حال اجرا است. این سرویس تمام پردازش‌هایی
 * که سمت سرور ایجاد شده است را مدیریت می‌کند. این مدیریت تنها شامل فهرست کردن یا
 * کنترل کردن حالت یک پردازش است.
 *
 * این مدیریت قادر به ایجاد یک پردازش نیست بلکه تنها آنها را فهرست می‌کند. این پردازش‌ها معمولا
 * در ازای یک فراخوانی در سیستم ایجاد می‌شوند.
 *
 */
.service('$process', function() {

  /**
   * فهرست تمام پردازش‌هایی که روی سرور هست را تعیین می‌کند. این پردازش‌ها بر اساس سطح
   * دسترسی در اختیار کاربران قرار خواهد گرفت.
   *
   * @memberof $process
   * @return {promis(PaginatedPage(PProcess))} صفحه‌ای از پردازش‌ها
   */
  this.processes = function(){};
  /**
   * اطلاعات یک پردازش را در اختیار کابران قرار می‌دهد. تمام پردازش‌هایی که با این روش بازیابی
   * شوند توسط این سرویس ردیابی و مدیریت می‌شوند.
   *
   * @memberof $process
   * @param  {Number} id شناسه پردازش مورد نظر
   * @return {promis(PProcess)}    یک دستگیره که پردازش مورد نظر را بازیابی می‌کند.
   */
  this.process = function(){};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf')
/**
 * @memberof pluf
 * @ngdoc service
 * @name $usr
 * 
 * @description یکی از مهم‌ترین سرویس‌هایی است که در این ماژول ارائه می‌شود. این
 *              سرویس موظف است که کاربر جاری را مدیریت کند. علاوه بر این
 *              امکاناتی برای ورود و خروج کاربران نیز فراهم کرده است.
 */
.service(
		'$usr',
		function($http, $httpParamSerializerJQLike, $q, $act, PUser,
				PaginatorPage, PException) {
			/*
			 * کاربر جاری را تعیین می‌کند. این متغیر به صورت عمومی در اختیار
			 * کاربران قرار می‌گیرد.
			 */
			this._su = new PUser();
			/*
			 * مخزن کاربران. تمام اطلاعاتی که از کاربران گرفته می‌شه توی این
			 * مخزن نگهداری می‌شه
			 */
			this._u = {};
			/*
			 * اطلاعات یک کاربر با شناسه تعیین شده را بازیابی می‌کند. این مقدار
			 * ممکن است تهی باشد.
			 */
			this._getUser = function(id) {
				if (this._u[id] && !this._u[id].isAnonymous()) {
					return this._u[id];
				}
				return null;
			};
			/*
			 * اطلاعات یک کاربر را بازیابی می‌کند
			 */
			this._ret = function(id, data) {
				var instance = this._getUser(id);
				if (instance) {
					instance.setData(data);
				} else {
					instance = new PUser(data);
					this._u[id] = instance;
				}
				return instance;
			};

			/**
			 * به صورت همزمان تعیین می‌کند که آیا کاربر جاری شناخته شده است یا
			 * نه. از این فراخوانی در نمایش و یا جایی که باید به صورت همزمان
			 * وضعیت کاربر جاری را تعیین کرده استفاده می‌شود.
			 * 
			 * @memberof $usr
			 * @return {Boolean} درستی در صورتی که کاربر جاری گمنام باشد
			 */
			this.isAnonymous = function() {
				return this._su.isAnonymous();
			};

			/**
			 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی
			 * نیز یک فراخوانی هم زمان است و در کارهای نمایشی کاربرد دارد.
			 * 
			 * @memberof $usr
			 * 
			 * @return {Boolean} درستی در صورتی که کاربر جاری مدیر سیستم باشد.
			 */
			this.isAdministrator = function() {
				return this._su.isAdministrator();
			};

			/**
			 * عمل ورود کاربر به سیستم را انجام می‌دهد. برای ورود بسته به اینکه
			 * از چه سیستمی استفاده می‌شود پارامترهای متفاوتی مورد نیاز است که
			 * با استفاده از یک ساختار داده‌ای برای این فراخوانی ارسال می‌شود.
			 * برای نمونه در مدل عادی این فراخوانی نیاز به نام کاربری و گذرواژه
			 * دارد که به صورت زیر عمل ورود انجام خواهد شد:
			 * 
			 * <pre><code>
			 * $usr.login({
			 * 	login : 'user name',
			 * 	password : 'password'
			 * }).then(function(user) {
			 * 	//Success
			 * 	}, function(ex) {
			 * 		//Fail
			 * 	});
			 * </code></pre>
			 * 
			 * @memberof $usr
			 * 
			 * @param {object}
			 *            credential پارارمترهای مورد انتظار در احراز اصالت
			 * @return {promise(PUser)} اطلاعات کاربر جاری
			 */
			this.login = function(c) {
				if (!this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(this);
					return deferred.promise;
				}
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/user/login',
					data : $httpParamSerializerJQLike(c),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(data) {
					scope._su = new PUser(data.data);
					return scope._su;
				});
			};

			/**
			 * کاربری که در نشست تعیین شده است را بازیابی می‌کند. این فراخوانی
			 * که یک فراخوانی غیر همزان است برای تعیین حالت کاربر در سیستم
			 * استفاده می‌شود. برای نمونه ممکن است که یک تابع منجر به خروج کاربر
			 * از سیستم شده باشد، در این حالت این فراخوانی حالت کاربر را بازیابی
			 * کرده و سیستم را به روز می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @returns {promise(PUser)} اطلاعات کاربر جاری
			 */
			this.session = function() {
				var scope = this;
				if (!this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(this._su);
					return deferred.promise;
				}
				return $http.get('/api/user/account').then(function(data) {
					scope._su = new PUser(data.data);
					return scope._su;
				});
			};

			/**
			 * این فراخوانی عمل خروج کاربری جاری از سیستم را انجام می‌دهد. با
			 * این کار تمام داده‌های کاربر جاری از سیستم حذف شده و سیستم به حالت
			 * اولیه برخواهد گشت.
			 * 
			 * @memberof $usr
			 * 
			 * @returns {promise(PUser)} کاربر جاری که اکنون لاگ‌اوت شده است
			 */
			this.logout = function() {
				if (this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(this._su);
					return deferred.promise;
				}
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/user/logout',
				}).then(function(data) {
					scope._su = new PUser(data.data);
					return scope._su;
				});
			};

			/**
			 * اطلاعات یک کاربر جدید را دریافت کرده و آن را به عنوان یک کاربر در
			 * سیستم ثبت می‌کند. حالت نهایی کاربر به نوع پیاده سازی سرور بستگی
			 * دارد. بر برخی از سرورها، به محض اینکه کاربر ثبت نام کرد حالت فعال
			 * رو داره و می‌تونه وارد سیستم بشه اما در برخی از سیستم‌ها نیاز به
			 * فرآیند فعال سازی دارد.
			 * 
			 * پارامترهای مورد نیاز برای ایجاد کاربر هم متفاوت هست. در برخی
			 * سیستم‌ها ایمیل، نام کاربری و گذرواژه مهم است و سایر پارامترهای به
			 * صورت دلخواه خواهد بود.
			 * 
			 * @memberof $usr
			 * 
			 * @param {object}
			 *            detail خصوصیت‌های کاربر
			 * @return {promise(PUser)} حساب کاربری ایجاد شده
			 */
			this.signup = function(detail) {
				// var scope = this;
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
				});
			};

			/**
			 * فهرست کاربران را به صورت صفحه بندی شده در اختیار قرار می‌دهد. این
			 * فهرست برای کاربردهای متفاوتی استفاده می‌شود مثل اضافه کردن به
			 * کاربران مجاز. دسترسی به فهرست کاربران تنها بر اساس سطوح امنیتی
			 * تعریف شده در سرور ممکن است و بسته به نوع پیاده سازی سرور متفاوت
			 * خواهد بود.
			 * 
			 * @memberof $usr
			 * 
			 * @param {PagintorParameter}
			 *            parameter پارامترهای مورد استفاده در صفحه بندی نتایج
			 * @return {promise(PaginatorPage)} صفحه‌ای از کاربران سیستم.
			 */
			this.users = function(p) {
				var scope = this;
				return $http({
					method : 'GET',
					url : '/api/user/find',
					params : p.getParameter()
				}).then(function(res) {
					var page = new PaginatorPage(res.data);
					var items = [];
					for (var i = 0; i < page.counts; i++) {
						var t = scope._ret(page.items[i].id, page.items[i]);
						items.push(t);
					}
					page.items = items;
					return page;
				});
			};

			/**
			 * اطلاعات کاربر جاری را به روزرسانی می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @return {promise(PUser)} اطلاعات به‌روزرسانی شده‌ی کاربر جاری
			 */
			this.updateCurrentUser = function() {
				if (!this.isAnonymous()) {
					var deferred = $q.defer();
					deferred.resolve(this);
					return deferred.promise;
				}
				var scope = this;
				return $http({
					method : 'POST',
					url : '/api/user/' + scope._su.id + '/account',
					data : $httpParamSerializerJQLike(scope._su),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(data) {
					var user = new PUser(data.data);
					return user;
				}, function(data) {
					throw new PException(data);
				});
			};

			/**
			 * اطلاعات کاربر را با استفاده از شناسه آن بازیابی می‌کند.
			 * 
			 * @memberof $usr
			 * 
			 * @param {string}
			 *            id شناسه کاربر مورد نظر
			 * @return {promise(PUser)} اطلاعات بازیابی شده کاربر
			 */
			this.getUser = function(id) {
				var scope = this;
				return $http({
					method : 'GET',
					url : '/api/user/' + id + '/account',
				}).then(function(data) {
					return scope._ret(data.data.id, data.data);
				});
			};

			/**
			 * اطلاعات کاربر با شناسه تعیین شده را به‌روزرسانی می‌کند
			 * 
			 * @memberof $usr
			 * 
			 * @param {string}
			 *            id شناسه کاربر مورد نظر
			 * @return {promis(PUser)} اطلاعات به‌روزرسانی شده‌ی کاربر
			 */
			this.updateUser = function(id, userData) {
				return $http({
					method : 'POST',
					url : '/api/user/' + id + '/account',
					data : $httpParamSerializerJQLike(userData),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(data) {
					var user = new PUser(data.data);
					return user;
				}, function(data) {
					throw new PException(data);
				});
			};

			/**
			 * کاربر با شناسه تعیین شده را حذف می‌کند
			 * 
			 * @memberof $usr
			 * 
			 * @param {string}
			 *            id شناسه کاربر مورد نظر
			 * @return {promis(PUser)} اطلاعات کاربر حذف شده به عنوان خروجی
			 *         برگردانده می‌شود
			 */
			this.removeUser = function(id) {
				return $http({
					method : 'DELETE',
					url : '/api/user/' + id + '/account',
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).then(function(data) {
					var user = new PUser(data.data);
					return user;
				}, function(data) {
					throw new PException(data);
				});
			};

			/**
			 * اطلاعات کاربر را با استفاده نام کاربری آن بازیابی می‌کند. کاربر
			 * با استفاده از آن می‌تواند وارد سیستم شود.
			 * 
			 * @memberof $usr
			 * @param {string}
			 *            login شناسه کاربر مورد نظر
			 * @return {promise(PUser)} اطلاعات بازیابی شده کاربر
			 */
			this.user = function(login) {
				var scope = this;
				return $http({
					method : 'GET',
					url : '/api/user/user/' + login,
				}).then(function(data) {
					return scope._ret(data.data.id, data.data);
				});
			};
		});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
//
// 'use strict';
// /**
//  * امکانات اولیه برای مکان‌یابی را در اختیار کاربران قرار می‌دهد.
//  */
// angular.module('pluf.jahanjoo', ['pluf'])
// /**
//  * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
//  */
// .factory('PTag', function(PObject, PException) {
//   var pTag = function() {
//     pTag.apply(this, arguments);
//   };
//   pTag.prototype = new PObject();
//   return pTag;
// })
// /**
//  * ابزارهای موردنیاز برای تعیین یک رای را ایجاد می‌کند.
//  */
// .factory('PVote', function(PObject, PException) {
//   var pVote = function() {
//     PObject.apply(this, arguments);
//   };
//   pVote.prototype = new PObject();
//   return pVote;
// })
// /**
//  * ساختار داده‌ای یک مکان را ایجاد می‌کند. علاوه بر این ابزارهای اولیه مورد نیاز
//  * برای دستکاری مکان را نیز در اختیار می‌گذارد
//  */
// .factory('PLocation', function($http, PObject, PException) {
//   /**
//    * یک نمونه جدید از این کلاس ایجاد می‌کند.
//    */
//   var pLocation = function() {
//     PObject.apply(this, arguments);
//   };
//   pLocation.prototype = new PObject();
//
//   /**
//    * این مکان را از سیستم حذف می‌کند.
//    */
//   pLocation.prototype.remove = function() {
//     var scope = this;
//     return $http({
//       method: 'DELETE',
//       url: '/api/jayab/location/' + this.id,
//     }).then(function(res) {
//       scope.id = 0;
//       return scope;
//     }, function(res) {
//       throw new PException('fail to delete the location.', res.data);
//     });
//   }
//   // returns module
//   return pLocation;
// })
// /**
//  * فراخوانی‌ها اولیه سیستم، مانند جستجو و فهرست کردن را فراهم می‌کند.
//  */
// .service(
//         '$jlocation',
//         function($rootScope, $http, $q, $window, $usr, PLocation,
//                 PaginatorPage, PException) {
//           this._pool = [];
//           /**
//            * یک نمونه جدید از این کلاس ایجاد کرده و اون رو توی مخزن می‌زاره
//            */
//           this.ret = function(d) {
//             if (d.id in this._pool) {
//               var t = this._pool[d.id];
//               t.setData(d);
//               return t;
//             }
//             var t = new PLocation(d);
//             this._pool[t.id] = t;
//             return t;
//           }
//           /**
//            * گرفتن اطلاعات یک مکان
//            */
//           this.location = function(i) {
//             if (i in this._pool) {
//               var d = $q.defer();
//               d.resolve(this._pool[i]);
//               return d.promise;
//             }
//             var scope = this;
//             return $http({
//               method: 'GET',
//               url: '/api/jayab/location/' + i,
//             }).then(function(res) {
//               return scope.ret(res.data);
//             }, function(res) {
//               throw new PException('fail to get locations.', res.data);
//             });
//           }
//           /**
//            * فهرستی از تمام مکان‌های اضافه شده در سیستم.
//            */
//           this.locations = function(p) {
//             var scope = this;
//             return $http({
//               method: 'GET',
//               url: '/api/jayab/location/list',
//               params: p.getParameter(),
//             }).then(function(res) {
//               var page = new PaginatorPage(res.data);
//               var items = [];
//               for (var i = 0; i < page.counts; i++) {
//                 var t = scope.ret(page.items[i]);
//                 items.push(t);
//               }
//               page.items = items;
//               return page;
//             }, function(res) {
//               throw new PException('fail to get locations.', res.data);
//             });
//           }
//           /**
//            * یک مکان جدید را در سیستم تعریف می‌کند این مکان باید به صورت زیر
//            * ایجاد بشه: { name: title, description: description, latitude: lat,
//            * longitude: long, }
//            */
//           this.add = function(p) {
//             var scope = this;
//             return $http({
//               method: 'POST',
//               url: '/api/jayab/location/create',
//               params: p,
//               headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//               }
//             }).then(function(res) {
//               return scope.ret(res.data);
//             }, function(res) {
//               throw new PException('fail to add location.', res.data);
//             });
//           }
//         });

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas', ['pluf'])

.run(function($window, $act, $saas, PException) {
	/**
	 * اضافه کردن دستورها و دستگیره‌ها
	 */
	$act
	.command({
		id: 'pluf.saas.lunch',
		category: 'saas',
	})
	.handler({
		commandId: 'pluf.saas.lunch',
		handle: function() {
			if (arguments.length < 1) {
				throw new PException('no app found');
			}
			var a = arguments[0];
			return $saas.get(a).then(function(tenant) {
				return tenant.defaultApplication();
			}).then(function(app) {
				return app.run();
			});
		}
	})
	// run spa
	.command({
		id: 'pluf.saas.app.lunch',
		category: 'saas',
	})
	.handler({
		commandId: 'pluf.saas.app.lunch',
		handle: function() {
			if (arguments.length < 1) {//
				throw new PException('no app found');
			}
			var a = arguments[0];
			return $saas.session().then(function(tenant) {
				return tenant.app(a);
			}).then(function(app) {
				return app.run();
			});
		}
	});
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PSpa
 * @description
 * اطلاعات یک نرم افزار را تعیین می‌کند.
 *
 * @attr {integer} id
 * @attr {string} name
 *
 */
.factory('PSpa', function($http, $q, $window, PSpaDetail, PObject) {

	var pSpa = function() {
		PObject.apply(this, arguments);
	};

	pSpa.prototype = new PObject();

	/**
	 * ملک پیش فرض را تعیین می‌کند. به صورتی پیش فرض یک نرم افزار به ملک خاصی تعلق ندارد
	 * اما برای سادگی توسعه اگر فهرست نرم افزارهای یک ملک را بگیرید ملک پیش فرض آن نیز
	 * تعیین می‌شود.
	 *
	 * @memberof PSpa
	 * @param  {PTenant} tenant ملک پیش فرض
	 * @return {PSpa}  خود نرم افزار
	 */
	pSpa.prototype.setTenant = function(tenant) {
		this._tenant = tenant;
		return this;
	};

	/**
	 * اطلاعات نرم افزار را دوباره بازیابی می‌کند. زمانی که یک نرم افزار به روز شده باشد با این
	 * فراخوانی اطلاعات جدید آن بارگذاری می‌شود.
	 *
	 * @memberof PSpa
	 * @return {PSpa} خود نرم افزار
	 */
	pSpa.prototype.reload = function(){};

	/**
	 * نرم افزار را به روز رسانی می‌کنند.
	 *
	 * @memberof PSpa
	 * @return {promise<PSpa>} نرم افزار به روز شده
	 */
	pSpa.prototype.update = function(){};

	/**
	 * نرم افزار را حذف می‌کند.
	 *
	 * @return {PSpa} نرم افزار حذف شده
	 */
	pSpa.prototype.delete = function(){};

	/**
	 * جزئیات یک نرم افزار را تعیین می‌کند. این جزئیات شامل اطلاعاتی مثل نویسندگان، ادرس تارنما
	 * و سایر مواردی می شود که توسعه دهنده در اختیار ما قرار می‌دهد.
	 *
	 * @memberof PSpa
	 * @return {PSpaDetail} جزئیات نرم افزار
	 */
	pSpa.prototype.detail = function() {
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
			scope._detail = new PSpaDetail(res.data);
			return scope._detail;
		});
	};

	/**
	 * اجرای نرم افزار.
	 *
	 * @memberof PSpa
	 */
	pSpa.prototype.run = function() {
		$window.location = $window.location.origin + '/' + this._tenant.id + '/' + this.id;
	};

	return pSpa;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PSpaDetail
 * @description
 * هر نسخه می‌تواند از یک نوع نرم افزار خاص نصب شده استفاده کند. البته نرم
 * افزارها باید تنها از خدمات ارائه شده در نسخه نصبی استفاده کنند. هر نرم افزار
 * می‌تواند شامل تنظیم‌های متفاتی باشد.
 */
.factory('PSpaDetail',
function($http, $q, $window, PObject) {
	var pSpaDetail = function() {
		PObject.apply(this, arguments);
	};
	pSpaDetail.prototype = new PObject();
	return pSpaDetail;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenant
 * @description
 *  ساختار داده‌ای یک ملک را تعیین می‌کنه
 */
.factory('PTenant', function(
	$http, $httpParamSerializerJQLike, $window, $q,
	PObject, PException, PProfile, PaginatorParameter, PaginatorPage,
	PSpa) {
	var pTenant = function() {
		PObject.apply(this, arguments);
	};
	pTenant.prototype = new PObject();

	pTenant.prototype._spa = [];
	pTenant.prototype._retSpa = function(spaData) {
		var t;
		if (spaData.id in this._spa) {
			t = this._spa[spaData.id];
			t.setData(spaData);
			return t;
		}
		t = new PSpa(spaData).setTenant(this);
		this._spa[t.id] = t;
		return t;
	};

	/**
	 * یک ملک را حذف می‌کند
	 *
	 * @memberof PTenant
	 * @return {promise<PTenant>} ملک حذف شده
	 */
	pTenant.prototype.delete = function(){
		//TODO:
	};

	/**
	 * اطلاعات ملک را به روز می‌کند
	 *
	 * @memberof PTenant
	 * @return {promise<PTenant>} خود ملک
	 */
	pTenant.prototype.update = function() {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/saas/' + this.id,
			data: $httpParamSerializerJQLike(this),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		});
	};

	/**
	 * تنظیم‌های یک ملک را تعیین می‌کند. این تنظیم‌ها توسط سیستم ایجاد شده است و تنها مدیریت
	 * سیستم قادر به تغییر آنها خواهد بود.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantSetting>} تنظیم‌های ملک
	 */
	pTenant.prototype.setting = function(){};

	/**
	 * تنظیم‌های ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantSetting>} تنظیم‌های ملک
	 */
	pTenant.prototype.config = function(){};

	// XXX: maso, 1395: مدل تعیین سطح دسترسی‌ها تعیین بشه
	pTenant.prototype.members = function() {
		if (this.isAnonymous() || this.memberLoaded()) {
			var deferred = $q.defer();
			if (this.isAnonymous()) {
				deferred.reject('authentication requried');
			}	else {
				deferred.resolve(this._member);
			}
			return deferred.promise;
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/app/' + this.id + '/member/list'
		}).then(function(res) {
			scope.$member.setData(res.data);
			return scope.$member;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * گروه‌های موجود در ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PaginatorPage<PTenantGroup>>} گروه‌های یک ملک
	 */
	pTenant.prototype.groups = function(){};

	/**
	 * اطلاعات گروه موجود در ملک را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantGroup>} اطلاعات گروه
	 */
	pTenant.prototype.group = function(){};

	/**
	 * فهرست دسترسی‌ها را تعیین می‌کند. دسترسی افراد به داده‌ها و  نرم افزارها بر اساس نقش آنها
	 * در ملک تعیین می‌شود. تمام نقش‌ها و دسترسی‌ها نیز با استفاده از ساختار دسترسی تعریف
	 * می‌شود. این فراخوانی تمام دسترسی‌هایی که در این ملک تعریف شده است را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PaginatorPage<PTenantAccess>>} فهرست صفحه بندی شده دسترسی‌ها
	 */
	pTenant.prototype.accesses = function(){};

	/**
	 * یک دسترسی خاص را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantAccess>} دسترسی تعیین شده
	 */
	pTenant.prototype.access = function(){};

	/**
	 * یک دسترسی جدید در ملک ایجاد می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PTenantAccess>} دسترسی معادل را تعیین می‌کند
	 */
	pTenant.prototype.newAccess = function(){};

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که در این ملک قابل دسترسی است.
	 *
	 * @memberof PTenant
	 * @param  {PaginatorPage} $params خصوصیت‌های صفحه بندی
	 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم افزارها به صورت صفحه بندی شده گ
	 */
	pTenant.prototype.spas = function($params) {
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
	};

	/*
	 * TODO: Hadi, 1395-04-18: 
	 * به نظر می‌رسه با توجه به قوانینی که در مورد ملک‌ها و spa ها داریم
	 * این متد نباید اینجا باشه و باید حذف بشه
	 */
	/**
	 * یک نرم افزار را تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @param  {integer} spaId شناسه نرم‌افزار
	 * @return {promise<PSpa>} نرم افزار مورد نظر
	 */
	pTenant.prototype.spa = function(spaId) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/spa/' + spaId,
		}).then(function(res) {
			return scope._regSpa(res.data);
		});
	};

	/**
	 * یک نرم افزار جدید را برای ملک تعیین می‌کند.
	 *
	 * @memberof PTenant
	 * @return {promise<PSpa>} نرم‌افزار ایجاد شده
	 */
	pTenant.prototype.newSpa = function(){};


	/**
	 * ملک را اجرا و به آن تغییر مسیر می‌دهد.
	 *
	 * @memberof PTenant
	 */
	pTenant.prototype.goto = function() {
		// XXX: maso, 1394: Check domain, subdomain and id
		$window.location = $window.location.origin + '/' + this.id;
	};
	return pTenant;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenantGroup
 * @description
 * تنظیم‌های یک ملک را تعیین می‌کند.
 *
 */
.factory('PTenantGroup', function($http, $q, $window, PObject) {
	var pTenantGroup = function() {
		PObject.apply(this, arguments);
	};
	pTenantGroup.prototype = new PObject();
	return pTenantGroup;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc factory
 * @memberof pluf.saas
 * @name PTenantSetting
 * @description
 * تنظیم‌های یک ملک را تعیین می‌کند.
 *
 */
.factory('PTenantSetting',
function($http, $q, $window, PObject) {
	var pTenantSetting = function() {
		PObject.apply(this, arguments);
	};
	pTenantSetting.prototype = new PObject();
	return pTenantSetting;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.saas')
/**
 * @ngdoc service
 * @name $saas
 * @memberof pluf.saas
 * @description
 * مدیریت ملک و نرم افزارها را انجام می‌دهد.
 */
.service('$saas', function (
		$http, $httpParamSerializerJQLike, $q, $window,
		$act, $usr,
		PTenant, PSpa,
		PException, PaginatorParameter,	PaginatorPage
	) {
	/*
	 * مدیریت ملکها در حافظه انجام می‌دهد
	 */
	this._tenant = [];
	this._retTenant = function(tenantData) {
		var t;
		if (tenantData.id in this._tenant) {
			t = this._tenant[tenantData.id];
			t.setData(tenantData);
			return t;
		}
		t = new PTenant(tenantData);
		this._tenant[t.id] = t;
		return t;
	};
	/*
	 * مدیریت نرم افزارها در حافظه
	 */
	this._spa = [];
	this._retSpa = function(spaData){
		var t;
		if (spaData.id in this._spa) {
			t = this._spa[spaData.id];
			t.setData(spaData);
			return t;
		}
		t = new PSpa(spaData);
		this._tenant[t.id] = t;
		return t;
	};

	/**
	 * نمونه جاری را تعیین می‌کند. به صورت پیش فرض اجرای هر نرم افزار روی یک ملک اجرا
	 * می‌شود این فراخوانی ملکی را تعیین می‌کند که نرم افزار جاری روی آن کار می‌کند.
	 *
	 * @memberof $saas
	 * @return {permision(PTenant)} ملک جاری را تعیین می‌کند.
	 */
	this.session = function() {
		var scope = this;
		return $http.get('/api/saas/tenant').then(function(res) {
			return scope.ret(res.data);
		});
	};

	/**
	 * فهرست ملک‌هایی را تعیین می‌کند که کاربر جاری مالکیت آنها را دارد و یا اینکه در آنها عضویت
	 * دارد.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter خصوصیت‌های صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} ملک‌های صفحه بندی شد
	 */
	this.mine = function(paginatorParameter) {
		if (!paginatorParameter) {
			paginatorParameter = new PaginatorParameter();
		}
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/app/userList',
			params: paginatorParameter.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			page.items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope.ret(res.data.items[i]);
				page.items.push(t);
			}
			return page;
		});
	};

	/**
	 * فهرست تمام ملک‌هایی را که کاربر به آنها دسترسی دارد را تعیین می‌کند.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PTenant>>} فهرست ملک‌ها به صورت صفحه بندی
	 */
	this.tenants = function(paginatorParameter) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/saas/tenant/find',
			params: paginatorParameter.getParameter(),
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
	};

	/**
	 * ملک تعیین شده با شناسه را برمی‌گرداند.
	 *
	 * @memberof $saas
	 * @param  {integer} id شناسه ملک مورد نظر
	 * @return {promise<PTenant>} ملک تعیین شده.
	 */
	this.tenant = function(id) {
		var scope = this;
		return $http.get('/api/saas/app/' + id)//
		.then(function(res) {
			return scope.ret(res.data);
		}, function(res) {
			throw new PException(res.data);
		});
	};

	/**
	 * یک ملک جدید ایجاد می‌کند و  ساختار ایجاد شده برای آنرا به عنوان نتیجه برمی‌گرداند.
	 *
	 * @memberof $saas
	 * @param  {Struct} tenantData ساختار داده‌ای ملک
	 * @return {promise<PTenant>} مکل ایجاد شده
	 */
	this.newTenant = function(t) {
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
	};

	/**
	 * فهرست تمام نرم افزارهایی را تعیین می‌کند که برای ملک جاری در دسترس است.
	 *
	 * @memberof $saas
	 * @param  {PaginatorParameter} paginatorParameter پارامترهای مورد استفاده در صفحه بندی
	 * @return {promise<PaginatorPage<PSpa>>} فهرست نرم افزارها
	 */
	this.spas = function(){};

	/**
	 * نرم افزار معادل با شناسه ورودی را بازیابی می‌کند.
	 *
	 * @memberof $saas
	 * @param  {integer} id شناسه نرم افزار
	 * @return {promise<PSpa>} نرم‌افزار معادل
	 */
	this.spa = function(){};

	/**
	 * یک نرم افزار جدید در سیستم ایجاد می‌کند.
	 *
	 * @memberof $saas
	 * @param  {Struct} spa ساختار داده‌ای یک spa
	 * @return {promise<PSpa} نرم‌افزار معادل ایجاد شده
	 */
	this.newSpa = function(){};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){

	'use strict';
	/**
	 * امکانات اولیه برای مکان‌یابی را در اختیار کاربران قرار می‌دهد.
	 */
	angular.module('pluf.social', ['pluf']);

})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.social')
/**
 * @ngdoc factory
 * @name PFollower
 * @memberof pluf.social
 * @description
 *
 * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
 */
	.factory('PFollower',	function(PObject) {

	var pFollower = function() {
		PObject.apply(this, arguments);
	};

	pFollower.prototype = new PObject();

	return pFollower;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.social')

/**
 * @ngdoc service
 * @name $news
 * @memberof saas
 *
 * @description
 * این سرویس امکاناتی نظیر ثبت و حذف follower ها و ارسال پیام به آن‌ها را مدیریت می‌کند
 */
.service('$news', function($httpParamSerializerJQLike, $http, $q, PException, PFollower,PaginatorPage){

	this._df = [];
	this._getf = function(i){
		return this._df[i];
	};
	this._retf= function(id, d){
		var i = this._getf(id);
		if (i) {
			i.setData(d);
			return i;
		}
		this._df[id] = new PFollower(d);
		return this._df[id];
	};


	this.validateFollower = function(f) {
		var def = $q.defer();
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(re.test(f)){
			def.resolve({
				type: 'email',
				address: f
			});
			return def.promise;
		}
		var mob = /^\+?\d{10,14}$/;
		if(mob.test(f)){
			def.resolve({
				type: 'mobile',
				address: f
			});
			return def.promise;
		}
		def.resolve({
			type: 'other',
			address: f
		});
		return def.promise;
	};

	// دنبالگرها
	this.newFollower = function(f){
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/newspaper/follower/new',
			data: $httpParamSerializerJQLike(f),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res){
			return scope._retf(res.data.id, res.data);
		});
	};
	this.followers = function(p){
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/newspaper/follower/find',
			params : p.getParameter()
		}).then(function(res){
			var page = new PaginatorPage(res.data);
			page.items = [];
			for (var i = 0; i < res.data.counts; i++) {
				page.items.push(scope._retf(res.data.items[i].id, res.data.items[i]));
			}
			return page;
		});
	};

	/**
	 * مشخصات دنبالگر را تعیین می‌کند.
	 *
	 * @return {promise<PFollower>} دنبالگر
	 */
	this.follower = function(){};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

/**
 * @ngdoc module
 * @name pluf.help
 *
 * @description
 * ماژول pluf.help مجموعه‌ای از امکانات را برای پیاده‌سازی یک ویکی فراهم می‌کند.
 * عناصر اصلی این ماژول Page و Book است و عملیاتی مدیریت آن‌ها مانند ایجاد، ویرایش، حذف و دریافت
 * آنها در این ماژول قرار داده شده است.
 */
angular.module('pluf.wiki', ['pluf']);

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.wiki')
/**
 * @ngdoc factory
 * @name PWikiBook
 * @memberof wiki
 *
 * @description
 * ساختار داده‌ای یک کتاب به همراه اطلاعات کامل صفحه.
 *
 * @attr {Integer} id شناسه کتاب
 * @attr {String} title عنوان کتاب
 * @attr {String} state وضعیت کتاب
 * @attr {String} language زبان مورد استفاده در متن صفحات کتاب
 * @attr {String} summary خلاصه یا توضیحی کوتاه در مورد کتاب
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد کتاب
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
	.factory('PWikiBook', function(PObject, PException, PWikiPageItem, PaginatorPage, $http, $httpParamSerializerJQLike, $q, $timeout) {

	var pWikiBook = function() {
		PObject.apply(this, arguments);
	};

	pWikiBook.prototype = new PObject();

	/**
	 * صفحه با شناسه داده شده را از فهرست صفحات کتاب بازیابی می‌کند.
	 *
	 * @private
	 * @memberof PWikiBook
	 * @param id شناسه صفحه
	 * @param data داده‌های صفحه
	 * @returns {PWikiPageItem}
	 */
	pWikiBook.prototype._retItem = function(id, data) {
		var item = null;
		for ( var i in this.items) {
			if (this.items[i].id === id) {
				item = this.items[i];
				break;
			}
		}
		if (!item) {
			item = new PWikiPageItem(data);
			this.items.push(item);
		}
		item.setData(data);
		return item;
	};

	/**
	 * اولین صفحه کتاب را برمی‌گرداند
	 *
	 * @memberof PWikiBook
	 * @returns {promise(PWikiPageItem)} یک PageItem مربوط به صفحه اول کتاب
	 */
	pWikiBook.prototype.firstPage = function() {
		var def = $q.defer();
		var scope = this;
		$timeout(function() {
			def.resolve(scope.items[0]);
		}, 1);
		return def.promise;
	};

	/**
	 * فهرستی از صفحات کتاب را برمی‌گرداند
	 *
	 * @memberof PWikiBook
	 * @returns {promise(PaginatedPage<PWikiPageItem>)}
	 *  فهرستی صفحه بندی شده از PageItem های مربوط به صفحات کتاب
	 */
	pWikiBook.prototype.pages = function() {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/wiki/book/' + scope.id + '/pages',
		}).then(function(res) {
			scope.items = [];
			for (var i = 0; i < res.data.length; i++) {
				scope._retItem(res.data[i].id, res.data[i]);
			}
			return scope.items;
		}, function(data) {
			throw new PException(data);
		});
	};
	/**
	 * یک صفحه را به کتاب اضافه می‌کند
	 *
	 * @memberof PWikiBook
	 * @param {PWikiPage} page صفحه‌ای که به کتاب اضافه خواهد شد
	 * @returns {promise(PWikiBook)} خود کتاب را که صفحه جدید به آن اضافه شده است برمی‌گرداند
	 */
	pWikiBook.prototype.addPage = function(page) {
		if(page.isAnonymous()){
			var dif = $q.defer();
			$timeout(function(){
				var ex = new PException({message:'Page id is null!'});
				dif.reject(ex);
			}, 1);
			return dif.promise;
		}
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/book/' + scope.id + '/page/' + page.id,
		}).then(function() {
			return scope;
		});
	};

	/**
	 * یک صفحه را از کتاب حذف می‌کند
	 *
	 * @memberof PWikiBook
	 * @param {PWikiPage} page صفحه‌ای که باید از کتاب حذف شود
	 * @returns {promise(PWikiPage)} صفحه حذف شده از کتاب را برمی‌گرداند
	 */
	pWikiBook.prototype.removePage = function(page) {
		if(page.isAnonymous()){
			var dif = $q.defer();
			$timeout(function(){
				var ex = new PException({message:'Page id is null!'});
				dif.reject(ex);
			}, 1);
			return dif.promise;
		}
		var scope = this;
		return $http({
			method: 'DELETE',
			url: '/api/wiki/book/' + scope.id + '/page/' + page.id,
		}).then(function() {
			return scope;
		});
	};

	/**
	 * اطلاعات یک کتاب را به‌روزرسانی می‌کند.
	 *
	 * @memberof PWikiBook
	 * @param {struct} b ساختاری حاوی اطلاعاتی از کتاب که باید به‌روزرسانی شود
	 * @returns {promise(PWikiBook)} کتاب با اطلاعات به‌روزرسانی شده
	 */
	pWikiBook.prototype.update = function(b) {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/book/' + scope.id,
			data: $httpParamSerializerJQLike(b),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * کتاب را حذف می‌کند
	 *
	 * @memberof PWikiBook
	 * @returns {promise(PWikiBook)} کتاب حذف شده
	 */
	pWikiBook.prototype.remove = function() {
		var scope = this;
		return $http({
			method: 'DELETE',
			url: '/api/wiki/book/' + scope.id
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	return pWikiBook;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.wiki')
/**
 * @ngdoc factory
 * @name PWikiPage
 * @memberof pluf.wiki
 *
 * @description
 * ساختار داده‌ای یک صفحه به همراه اطلاعات کامل صفحه.
 *
 * @attr {Integer} id شناسه صفحه
 *
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 *
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 * @attr {Integer} book شناسه کتابی که این صفحه متعلق به آن است
 * @attr {String} language زبان مورد استفاده در متن صفحه
 * @attr {String} summary خلاصه‌ای از متن صفحه
 * @attr {Blob} content محتوای صفحه
 *
 * @attr {String} content_type
 * نوع متن صفحه. مثلا: text/html, text/plain, text/markdown , ...
 *
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد page
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */

.factory('PWikiPage', function($http, $httpParamSerializerJQLike, PException, PObject) {

	var wikiPage = function(d) {
		if (d) {
			this.setData(d);
		}
	};

	wikiPage.prototype = new PObject();

	/**
	 * اطلاعات یک صفحه را به‌روزرسانی می‌کند.
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {promise(PWikiPage)} صفحه به‌روزرسانی شده
	 */
	wikiPage.prototype.update = function() {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/page/' + this.id,
			data: $httpParamSerializerJQLike(scope),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * صفحه را حذف می‌کند
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {promise(PWikiPage)} صفحه حذف شده برگردانده می شود
	 */
	wikiPage.prototype.remove = function() {
		var scope = this;
		return $http({
			method: 'DELETE',
			url: '/api/wiki/page/' + scope.id
		}).then(function(res) {
			scope.setData(res.data);
			return scope;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * محتوای صفحه را به قالب html تبدیل می‌کند.
	 *
	 * @memberof PWikiPage
	 *
	 * @returns {String} محتوای صفحه در قالب html
	 */
	wikiPage.prototype.toHTML = function() {
		return markdown.toHTML(this.content);
	};
	return wikiPage;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

angular.module('pluf.wiki')
/**
 * @ngdoc factory
 * @name PWikiPageItem
 * @memberof wiki
 *
 * @description
 * ساختار داده‌ای یک آیتم از نوع صفحه با کمترین اطلاعات ممکن.
 *
 * @attr {Integer} id شناسه PageItem
 *
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 *
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 *
 */
.factory('PWikiPageItem', function(PObject) {

	var wikiPageItem = function(d) {
		if (d) {
			this.setData(d);
		}
	};

	wikiPageItem.prototype = new PObject();

	/**
	 * صفحه مربوط به این PageItem را برمی گرداند
	 *
	 * @memberof PWikiPageItem
	 * @returns {promise(PWikiPage)} صفحه مربوط به این PageItem
	 */
	wikiPageItem.prototype.page = function() {
		// TODO: پیاده‌سازی شود
	};

	return wikiPageItem;
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
angular.module('pluf.wiki')
/**
 * فیلتر نمایش صفحه‌ها را ایجاد می‌کند.
 */
.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';


angular.module('pluf.wiki')
/**
* @ngdoc service
* @name $help
* @memberof wiki
*
* @description
* این سرویس امکانات مدیریت صفحه‌ها و کتاب‌های ویکی را فراهم می‌کند. با استفاده از این سرویس
* می‌توان صفحات و کتاب‌های ویکی را ایجاد، حذف، جستجو و یا دریافت کرد.
*/
.service('$help', function($http, $httpParamSerializerJQLike, $q, PException, PWikiPage,
		PWikiBook, PaginatorPage) {
	/*
	 * کار با صفحه‌ها
	 */
	/** @private */
	this._ppage = {};
	/** @private */
	this._getPage = function(id) {
		return this._ppage[id];
	};
	/** @private */
	this._setPage = function(page) {
		this._ppage[page.id] = page;
	};
	/** @private */
	this._retPage = function(id, data) {
		var instance = this._getPage(id);
		if (instance) {
			instance.setData(data);
		} else {
			instance = new PWikiPage(data);
			this._setPage(instance);
		}
		return instance;
	};

	/*
	 * کار با کتابها
	 */
	/** @private */
	this._pbook = {};
	/** @private */
	this._getBook = function(id) {
		return this._pbook[id];
	};
	/** @private */
	this._setBook = function(page) {
		this._pbook[page.id] = page;
	};
	/** @private */
	this._retBook = function(id, data) {
		var instance = this._getBook(id);
		if (instance) {
			instance.setData(data);
		} else {
			instance = new PWikiBook(data);
			this._setBook(instance);
		}
		return instance;
	};

	/* فراخوانی‌های عمومی */
	/**
	 * کتاب‌های ویکی را با توجه به پارامتر p مورد جستجو قرار می‌دهد و نتیجه را در قالب
	 * یک فهرست صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
	 * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
	 *
	 * @memberof $help
	 * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
	 * @return {promise(PaginatorPage<PWikiBook>)} ساختاری صفحه‌بندی شده از کتاب‌ها در نتیجه جستجو
	 */
	this.books = function(p) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/wiki/book/find',
			params: p.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			var items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope._retBook(page.items[i].id, page.items[i]);
				items.push(t);
			}
			page.items = items;
			return page;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * کتاب با شناسه داده شده را برمی گرداند.
	 *
	 * @memberof $help
	 * @param {Integer} id شناسه کتاب مورد نظر
	 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب با شناسه داده شده
	 */
	this.book = function(id) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/wiki/book/' + id,
		}).then(function(res) {
			var book = scope._retBook(res.data.id, res.data);
			return book;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * یک کتاب را بر اساس اطلاعات داده شده ایجاد می‌کند و کتاب ایجاد شده را
	 * به صورت غیرهمزمان برمی‌گرداند.
	 *
	 * @memberof $help
	 * @param {PWikiBook} b کتابی که باید ذخیره شود
	 * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب پس از ذخیره شدن
	 */
	this.createBook = function(b) {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/book/create',
			data: $httpParamSerializerJQLike(b),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			var t = scope._retBook(res.data.id, res.data);
			return t;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * صفحات ویکی را با توجه به پارامتر p مورد جستجو قرار داده و صفحات نتیجه را
	 * در قالب یک ساختار صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
	 * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
	 *
	 * @memberof $help
	 * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
	 * @return {promise(PaginatorPage<PWikiPage>)} ساختاری صفحه‌بندی شده از صفحات در نتیجه جستجو
	 */
	this.pages = function(p) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/wiki/page/find',
			params: p.getParameter(),
		}).then(function(res) {
			var page = new PaginatorPage(res.data);
			var items = [];
			for (var i = 0; i < page.counts; i++) {
				var t = scope._retPage(page.items[i].id, page.items[i]);
				items.push(t);
			}
			page.items = items;
			return page;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * صفحه با شناسه داده شده را برمی گرداند.
	 *
	 * @memberof $help
	 * @param {Integer} id شناسه صفحه مورد نظر
	 * @return {promise(PWikiPage)} ساختاری حاوی اطلاعات صفحه با شناسه داده شده
	 */
	this.page = function(id) {
		var scope = this;
		return $http({
			method: 'GET',
			url: '/api/wiki/page/' + id,
		}).then(function(res) {
			var page = scope._retPage(res.data.id, res.data);
			return page;
		}, function(data) {
			throw new PException(data);
		});
	};

	/**
	 * یک صفحه را بر اساس اطلاعات داده شده ایجاد می‌کند و صفحه ایجاد شده را
	 * به صورت غیرهمزمان برمی‌گرداند.
	 *
	 * @memberof $help
	 * @param {PWikiPage} b صفحه‌ای که باید ذخیره شود
	 * @return {PWikiPage} ساختاری حاوی اطلاعات صفحه پس از ذخیره شدن
	 */
	this.createPage = function(p) {
		var scope = this;
		return $http({
			method: 'POST',
			url: '/api/wiki/page/create',
			data: $httpParamSerializerJQLike(p),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(res) {
			var t = scope._retPage(res.data.id, res.data);
			return t;
		}, function(data) {
			throw new PException(data);
		});
	};

});
