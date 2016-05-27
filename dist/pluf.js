/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	// 'use strict';
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
	angular
		.module('pluf', [])
		.run(function($usr, $act) {
			$act.command({
				id : 'pluf.user.login',
				label : 'login',
				description : 'login a user',
				visible : function() {
					return $usr.isAnonymous();
				},
				category : 'usr',
			}).handler({
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

//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PCommand',[
      PCommand
    ]);

  /**
   * @memberof pluf
   * @ngdoc factory
   * @name PCommand
   * @description
   * ساختار داده‌ای دستور را تعیین می‌کند. این ساختار داده‌ای به صورت داخلی استفاده می‌شود و برای نگهداری
   * دستورهایی است که کاربران به سیستم اضافه می‌کنند. مهم‌ترین پارامتر موجود در این ساختار داده‌ای
   * فهرستی از دستگیره‌ها است که در ازای اجرا این دستور اجرا خواهند شد.
   */
  function PCommand() {
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
  }

})(window.angular);

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PContent',[
			'$http', '$httpParamSerializerJQLike', '$q', 'PObject', 'PException',
			PContent
		]);
	/**
	 * @memberof pluf
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
	function PContent($http, $httpParamSerializerJQLike, $q, PObject,	PException) {
		var pContent = function() {
			PObject.apply(this, arguments);
		};
	 	pContent.prototype = new PObject();
		// TODO:maso, 1395: به روز کردن محتوی
		pContent.prototype.update = function(){
		};
		// TODO:maso, 1395: حذف محتوی
		pContent.prototype.remove = function(){
		};
		// TODO: maso, 1395: محتوی صفحه را می‌دهد
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
			});
		};
		pContent.prototype.setValue = function(d){
			var scope = this;
			return $http({
				method:'POST',
				url: '/api/saascms/content/'+this.id+'/download',
				data: d,
			}).then(function(res){
				return scope;
			});
		};
	 	return pContent;
	 }

//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PException', [
			'PObject',
			PException
		]);

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
	function PException(PObject) {
		var pException = function() {
			PObject.apply(this, arguments);
		};
		pException.prototype = new PObject();
		return pException;
	}

//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PHandler',[
      PHandler
    ]);

  /**
   * @memberof pluf
   * @ngdoc factory
   * @name PHandler
   * @description
   * ساختار داده‌ای برای یک دستگیره را ایجاد می‌کند. دستگیره یک عمل اجرایی است که در مقابل فراخوانی
   * یک دستور در سیستم اجرا می‌شود.
   */
  function PHandler() {
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
  }

})(window.angular);

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PMenu',[
      'PMenuItem',
      PMenu
    ]);

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
  function PMenu() {
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
  }

})(window.angular);

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PMenuItem',[
       '$window', '$act',
      PMenuItem
    ]);

  /**
   * @memberof pluf
   * @ngdoc factory
   * @name PMenuItem
   * @description
   * ساختار داده‌ای دستور را تعیین می‌کند. این ساختار داده‌ای به صورت داخلی استفاده می‌شود و برای نگهداری
   * دستورهایی است که کاربران به سیستم اضافه می‌کنند. مهم‌ترین پارامتر موجود در این ساختار داده‌ای
   * فهرستی از دستگیره‌ها است که در ازای اجرا این دستور اجرا خواهند شد.
   */
  function PMenuItem($window, $act) {
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
     angular.extend(this, data);
     if ('command' in data) {
       var scope = this;
       $act.getCommand(data.command).then(function(command) {
         scope.active = function() {
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
         };
         if (!('enable' in scope)) {
           scope.enable = command.enable;
         }
         if (!('label' in scope) && ('label' in command)) {
           scope.label = command.label;
         }
         if (!('priority' in scope)) {
           scope.priority = command.priority;
         }
         if (!('description' in scope)) {
           scope.priority = command.description;
         }
         if (!('visible' in scope)) {
           scope.visible = command.visible;
         }
         // XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
       });
     } else if ('action' in menu) {
       menu.active = function() {
         return menu.action();
       };
       // XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
     } else if ('link' in menu) {
       menu.active = function() {
         $window.location = menu.link;
       };
       // XXX: maso, 1394: خصوصیت‌های دیگر اضافه شود.
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
    return pMenuItem;
  }

})(window.angular);

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PNamedContent', [
			'$http', '$httpParamSerializerJQLike', '$q', 'PObject', 'PException', 'PContent',
			PNamedContent
		]);

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
		function PNamedContent($http, $httpParamSerializerJQLike, $q, PObject, PException, PContent){
			var pNamedContent = function() {
				PObject.apply(this, arguments);
			};
			pNamedContent.prototype = new PObject();
			// XXX: maso, 1395: به روز کردن صفحه
			pNamedContent.prototype.update = function(){
			};
			// XXX: maso, 1395: حذف صفحه
			pNamedContent.prototype.remove = function(){
			};
			// // XXX: maso, 1395: تعیین محتوی
			// pNamedContent.prototype.content = function(){
			// 	var deferred = $q.defer();
			// 	deferred.resolve(new PContent({id:2}));
			// 	return deferred.promise;
			// }
			pNamedContent.prototype.value = function(){
				return this.content.value();
			};
			pNamedContent.prototype.setValue = function(v){
				return this.content.setValue(v);
			};
			return pNamedContent;
		}
//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function() {
	angular
		.module('pluf')
		.factory('PObject',[PObject]);
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
		function PObject() {
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
		}
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PaginatorPage', [
			'PObject',
			PaginatorPage
		]);

	/**
	 * @name PaginatorPage
	 * @ngdoc factory
	 * @memberof pluf
	 * @description
	 * ساختار داده‌ای را تعیین می‌کند که در صفحه بندی داده‌ها به کار گرفته می‌شود. تمام داده‌های که
	 * از سرور ارسال می‌شود به صورت صفحه بندی است و تعداد آنها محدود است. این داده‌ها با
	 * این ساختار داده‌ای در اختیار کاربران قرار می‌گیرد.
	 */
	function PaginatorPage(PObject) {
		var paginatorPage = function() {
			PObject.apply(this, arguments);
		};
		paginatorPage.prototype = new PObject();
		return paginatorPage;
	}

// پایان
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PaginatorParameter',[
			PaginatorParameter
		]);
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
	 * @attr {Integer}_px_ps  تعداد آیتم‌های موجود در هر صفحه
	 * @attr {string} _px_fk نام خصوصیتی که برای فیلتر کردن مورد استفاده قرار می‌گیرد
	 * @attr {string} _px_fv مقداری مورد نظر برای خصوصیتی که بر اساس آن فیلتر انجام می‌شود.
	 * @attr {string} _px_sk نام خصوصیتی که فهرست باید بر اساس آن مرتب شود.
	 * @attr {string} _px_so ترتیب مرتب‌سازی، اینکه مرتب‌سازی به صورت صعودی باشد یا نزولی
	 *
	 */
	function PaginatorParameter() {
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
	}

// پایان
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PPreferenceNode',[
			'PObject',
			PPreferenceNode
		]);

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
		function PPreferenceNode(PObject) {
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
			};
			/**
			 * گره تعیین شده با نام را پیدا کرده و به عنوان نتیجه برمی‌گرداند
			 * @memberof PPreferenceNode
			 * @param  {String} n نام گره مورد نظر
			 * @return {PaginatorPage(PPreferenceNode)}  زیرگره معادل
			 */
			pPreferenceNode.prototype.node = function(n) {
				//XXX: maso, 1395: از بین بچه‌ها گره مناسب را پیدا کرده و به عنو نتیجه برمی‌گرداند
			};
			/**
			 * تمام زیر گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد.
			 * @memberof PPreferenceNode
			 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
			 * @return {promise(PaginatorPage)}   گره‌ها به صورت صفحه بندی شده.
			 */
			pPreferenceNode.prototype.nodes = function(p) {
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
		}


//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PPreferenceProperty',[
			'PPreferenceNode',
			PPreferenceProperty
		]);

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
	function PPreferenceProperty(PPreferenceNode) {
		var pPreferenceProperty = function() {
			PPreferenceNode.apply(this, arguments);
		};
		pPreferenceProperty.prototype = new PPreferenceNode();
		/**
		 * مقدار جدید را برای این خصوصیت تعیین می‌کند
		 * @param {Object} v مقدار جدید
		 */
		pPreferenceProperty.prototype.setValue = function(v){};
		/**
		 * مقدار خصوصیت را تعیین می‌:کند.
		 * @return {Object} مقدار خصوصیت
		 */
		pPreferenceProperty.prototype.value = function(){};
		return pPreferenceProperty;
	}

// End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.factory('PProcess', [
			'PObject',
			PProcess
		]);

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
	function PProcess(PObject) {
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
			if(this.progress.totalWorked <= 0)
				return 0;
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

		return pProgressMonitor;
	}

//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function() {
	angular
		.module('pluf')
		.factory('PProfile', [
			'$http', '$httpParamSerializerJQLike', '$q', 'PObject', 'PException',
			PProfile
		]);

	/**
	 * @memberof pluf
	 * @ngdoc factory
	 * @name PProfile
	 * @description
	 * هر کاربر در هر سیستم یک پروفایل مخصوص به خود دارد که شامل یه سری اطلاعات کلی می‌شود.
	 * این اطلاعات برای هر نرم افزار می‌تواند متفاوت باشد برای نمونه شما در سیستم فروش یک پروفایل
	 * دارید که شامل شماره تماس است اما در سیستم کتابداری پروفایل شما شامل شماره دانشجویی
	 * است.
	 *
	 * طبعت متغیر این مدل داده‌ای منجر به این شده که این مدل یک مدل کلی به صورت کلید مقدار باشد
	 * که شما می‌توانید مقادر مورد نظر خود را در آن اضافه و کم کنید.
	 */
	function PProfile( $http, $httpParamSerializerJQLike, $q, PObject, PException) {
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
		};
		return pProfile;
	}

//End
})();

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

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$act',[
			'$q', '$timeout', 'PCommand', 'PHandler',
			act
		]);

/**
 * @memberof pluf
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
 * فراخوانی این دستور منجر به اجرا شدن تمام دستگیره‌هایی مرتبط خواهد شد. تعریف این دستور و دستیگره‌های
 * آن در نمونه‌های زیر اورده شده است.
 *
 * @example
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
 *
 * @example
 * // اجرای دستور
 * $act.execute('user.login',{
 * 	login: 'admin',
 * 	password: 'admin'
 * });
 */
	function act($q, $timeout, PCommand, PHandler) {
		/*
		 * فهرستی از تمام دستورهای تعریف شده را نگهداری می ‌کند
		 */
		this._commands = [];

		/**
		 * دستور معادل با شناسه ورودی را تعیین می‌کند. در صورتی که دستور معادل وجود نداشته باشد یک
		 * خطا صادر خواهد شد.
		 *
		 * @memberof $act
		 * @param  {string} id شناسه دستور را تعیین می‌کند.
		 * @return {promise(PCommand)}    [description]
		 */
		this.getCommand = function(id) {
			var def = $q.defer();
			var scope = this;
			$timeout(function() {
				if(id in scope._commands){
					def.resolve(scope._commands[id]);
					return;
				}
				def.reject({status:404, code:10, message:'command not found'});
			}, 1);
			return def.promise;
		};

		/**
		 * یک دستور جدید به سیستم اضافه می‌کند. در صورتی که دستوری با شناسه دستور قبلا در سیستم
		 * موجود باشد، دستور جدید با مورد قبل جایگزین خواهد شد.
		 *
		 * @param  {Object} command یک ساختار داده‌ای که پارامترهای دستور را تعیین می‌‌کند
		 * @return {$act} ساختار داده‌ای دستور
		 */
		this.command = function(cmdData) {
			// دستور باید شناسه داشته باشد
			if(!cmdData.id){
				//TODO: maso, 1395: پیام مناسبی برای خطا ایجاد شود.
				throw {status:404, code:11, message:'Command id is empty'};
			}
			var cmd;
			if(cmdData.id in this._commands){
				// TODO: maso, 1395: یه پیام اخطار که پیام وجود داشته
				cmd = this._commands[cmdData.id];
			} else {
				cmd = new PCommand(cmdData);
			}
			this._commands[cmd.id] = cmd;
			return this;
		};

		/**
		 * یک دستگیریه را به فهرست دستگیره‌های یک دستور اضافه می‌کند.
		 *
		 * @param {object} ساختار داده‌ای که یک دستیگره را توصیف می‌کند.
		 * @return {$act} خود سیستم مدیریت دستورها را برمی‌گرداند
		 */
		this.handler = function(handData) {
			var cmd;
			if(handData.id in this._commands){
				cmd = this._commands[handData.id];
			} else {
				cmd = new PCommand(handData);
				this._commands[cmd.id] = cmd;
			}
			cmd.handler(new PHandler(handData));
			return this;
		};

		/**
		 * یک دستور را به صورت غیر همزمان اجرا می‌کند. اجرای دستور معادل با این است که تمام دستگیره‌های
		 * ان به ترتیب اجرا شوند. امکان ارسال پارامتر به تمام دستگیره‌ها وجود دارد. برای این کار کافی است
		 * که پارامترهای اضافه را بعد از پارامتر دستور وارد کنید. برای نمونه فرض کنید که دستور ورود کاربر
		 * به صورت زیر تعریف شده است:
		 *
		 * <pre><command>
		 * 	$act.command({
		 * 		id: 'user.login',
		 * 		label: 'login'
		 * 	}).handler({
		 * 		command: 'user.login',
		 * 		handle: function(credential){
		 * 			// Do something
		 * 		}
		 * 	})
		 * </command></pre>
		 *
		 * در این صورت به سادگی می‌توان این دستور را به صورت زیر فراخوانی کرد:
		 *
		 * <pre><command>
		 * 	$act.execute('user.login',{
		 * 		login: 'user login',
		 * 		password: 'user password'
		 * 	});
		 * </command></pre>
		 *
		 * @memberof $act
		 * @param  {string} command دستور
		 * @return {promise}   نتیجه اجرای دستورها
		 */
		this.execute = function(command) {
			var def = $q.defer();
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
			} else {
				def.reject({
					message : 'Command not found :' + command,
					statuse : 400,
					code : 4404
				});
			}
			return def.promise;
		};
	}

})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$cms',[
			'$http', '$httpParamSerializerJQLike', '$q', '$timeout', 'PContent',	'PNamedContent', 'PaginatorPage', 'PException',
			cms
		]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $cms
	 * @description
	 *
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
	function cms($http, $httpParamSerializerJQLike, $q, $timeout,	PContent, PNamedContent, PaginatorPage, PException) {
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
		 * @param  {Integer} id [description]
		 * @return {promise(PContent)}   [description]
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
		 * @param  {PaginatorParameter} p [description]
		 * @return {promise(PaginatorPage(PContent))}   [description]
		 */
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
		};

		/**
		 * یک صفحه نامدار جدید ایجاد می‌کند.
		 *
		 * @memberof $cms
		 * @param  {string} name [description]
		 * @param  {PContent} content [description]
		 * @return {promise(PNamedContent)}   [description]
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
		 * @param  {string} name [description]
		 * @return {promise(PNamedContent)}   [description]
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
	}

})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$menu',['$q', '$timeout', 'PMenu', 'PMenuItem', menu]);

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
	 * 		$menu.add('header', {
	 * 			command: 'usr.login'
	 * 		}).add('header', {
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
	function menu($q, $timeout, PMenu, PMenuItem) {
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
			if (id in this.menus) {
				this.menus[id].item(menu);
			}
			this.menus[id] = new PMenu({'id': id});
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
	}
// پایان
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$notify',[
			'$rootScope', '$timeout', '$q',
			notify
		]);
	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $notify
	 * @description
	 * یک سیستم ساده است برای اعلام پیام در سیستم. با استفاده از این کلاس می‌توان
	 * پیام‌های متفاوتی که در سیستم وجود دارد را به صورت همگانی اعلام کرد.
	 */
	function notify($rootScope, $timeout, $q) {
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
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onInfo = function(listener) {
			this._info.push(listener);
			return this;
		};
		/**
		 * تمام واسطه‌های تعیین شده برای پیام را فراخوانی کرده و آنها را پیام ورودی
		 * آگاه می‌کند.
		 */
		this.info = function() {
			return this._fire(this._info, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onWarning = function(listener) {
			this._warning.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌های اخطاری که در سیستم تولید شده است را به سایر شنودگرها ارسال
		 * کرده و آنها را از بروز آن آگاه می‌کند.
		 */
		this.warning = function() {
			return this._fire(this._warning, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onDebug = function(listener) {
			this._debug.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌هایی که برای رفع خطا در سیستم تولید می‌شود را برای تمام
		 * شنودگرهای اضافه شده ارسال می‌کند.
		 */
		this.debug = function() {
			return this._fire(this._debug, arguments);
		};
		/*
		 * یک شنودگر جدید به فهرست شنودگرها اضافه می‌کند.
		 */
		this.onError = function(listener) {
			this._error.push(listener);
			return this;
		};
		/**
		 * تمام پیام‌های خطای تولید شده در سیتسم را برای تمام شوندگرهایی خطا صادر
		 * کرده و آنها را از آن مطلع می‌کند.
		 */
		this.error = function() {
			return this._fire(this._error, arguments);
		};
		/*
		 * یک رویداد خاص را در کل فضای نرم افزار انتشار می‌دهد. اولین پارامتر ورودی
		 * این تابع به عنوان نام و شناسه در نظر گرفت می‌شود و سایر پارامترها به
		 * عنوان پارامترهای ورودی آن.
		 */
		this.broadcast = function() {
			return $rootScope.$broadcast.apply($rootScope, arguments);
		};
	}

// پایان
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$preference', [
			'$rootScope',
			preference
		]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $preference
	 * @description
	 * مدیریت داده‌های محلی کاربر را انجام می‌دهد. این داده‌ها به صورت محلی در
	 * مرورگر ذخیره سازی می‌شوند.‌
	 */
	 function preference($rootScope) {
		/**
		 * یک گره با نام جدید ایجاد می‌کند
		 * @memberof $preference
		 * @param  {String} n نام گره
		 * @return {promise(PPreferenceNode)}   دستگیره گره جدید
		 */
		this.newNode = function(n) {};
		/**
		 * گره با مسیر تعیین شده را پیدا کرده و به عنوان نتیجه برمی‌گرداند
		 * @memberof $preference
		 * @param  {String} path گره تنظیم‌ها
		 * @return {promise(PPreferenceNode)}     گره مورد نظر
		 */
		this.node = function(path) {};
		/**
		 * فهرست همه گره‌ها را به صورت صفحه بندی شده در اختیار می‌گذارد
		 * @memberof $preference
		 * @param  {PaginatorParameter} p پارامترهای صفحه بندی
		 * @return {promise(PaginatorPage)}  دستگیره فهرست گره‌ها
		 */
		this.nodes = function(p) {};
	}

//End
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
  angular
    .module('pluf')
    .service('$process',[
      process
    ]);

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
  function process() {

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
    this.process = function(id){};
  }
})();

/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$usr', [
			'$http', '$httpParamSerializerJQLike', '$q', '$act', 'PUser',
			user
		]);

	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $usr
	 * @description
	 * یکی از مهم‌ترین سرویس‌هایی است که در این ماژول ارائه می‌شود. این سرویس موظف است که کاربر جاری
	 * را مدیریت کند. علاوه بر این امکاناتی برای ورود و خروج کاربران نیز فراهم کرده است.
	 */
	function user($http, $httpParamSerializerJQLike, $q, $act, PUser) {
		/*
     * کاربر جاری را تعیین می‌کند. این متغیر به صورت عمومی در اختیار کاربران قرار می‌گیرد.
		 */
		this._su = new PUser();
		/*
		 * مخزن کاربران. تمام اطلاعاتی که از کاربران گرفته می‌شه توی این مخزن نگهداری می‌شه
		 */
		this._u = {};
		/*
		 * اطلاعات یک کاربر با شناسه تعیین شده را بازیابی می‌کند. این مقدار ممکن است تهی باشد.
		 */
		this._getUser = function(id) {
			if(this._u[id] &&! this._u[id].isAnonymous())
				return this._u[id];
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
		 * به صورت همزمان تعیین می‌کند که آیا کاربر جاری شناخته شده است یا نه. از این فراخوانی در نمایش
		 * و یا جایی که باید به صورت همزمان وضعیت کاربر جاری را تعیین کرده استفاده می‌شود.
		 *
		 * @memberof $usr
		 * @return {Boolean} درستی در صورتی که کاربر جاری گمنام باشد
		 */
		this.isAnonymous = function() {
			return this._su.isAnonymous();
		};

		/**
		 * تعیین می‌کند که آیا کاربر جاری مدیر سیستم است یا نه. این فراخوانی نیز یک فراخوانی هم زمان
		 * است و در کارهای نمایشی کاربرد دارد.
		 *
		 * @memberof $usr
		 * @return {Boolean} درستی در صورتی که کاربر جاری مدیر سیستم باشد.
		 */
		this.isAdministrator = function() {
			return this._su.isAdministrator();
		};
		/**
		 * عمل ورود کاربر به سیستم را انجام می‌دهد. برای ورود بسته به اینکه از چه سیستمی استفاده می‌شود
		 * پارامترهای متفاوتی مورد نیاز است که با استفاده از یک ساختار داده‌ای برای این فراخوانی ارسال
		 * می‌شود. برای نمونه در مدل عادی این فراخوانی نیاز به نام کاربری و گذرواژه دارد که به صورت
		 * زیر عمل ورود انجام خواهد شد:
		 *
		 * <pre><code>
		 * $usr.login({
		 * 	login: 'user name',
		 * 	password: 'password'
		 * }).then(function(user){
		 * 	//Success
		 * }, function(ex){
		 * 	//Fail
		 * });
		 * </code></pre>
		 *
		 * @memberof $usr
		 * @param  {object} cridential پارارمترهای مورد انتظار در احراز اصالت
		 * @return {promise(PUser)}   اطلاعات کاربر جاری
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
		 * کاربری که در نشست تعیین شده است را بازیابی می‌کند. این فراخوانی که یک فراخوانی غیر همزان
		 * است برای تعیین حالت کاربر در سیستم استفاده می‌شود. برای نمونه ممکن است که یک تابع منجر
		 * به خروج کاربر از سیستم شده باشد، در این حالت این فراخوانی حالت کاربر را بازیابی کرده و سیستم
		 * را به روز می‌کند.
		 *
		 * @memberof $usr
		 * @returns {promise(PUser)} قول اجرای غیر هم زمان
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
		 * این فراخوانی عمل خروج کاربری جاری از سیستم را انجام می‌دهد. با این کار تمام داده‌های کاربر
		 * جاری از سیستم حذف شده و سیستم به حالت اولیه برخواهد گشت.
		 *
		 * @memberof $usr
		 * @returns {promise(PUser)} کاربر جاری
		 */
		this.logout = function() {
			if (this.isAnonymous()) {
				var deferred = $q.defer();
				deferred.resolve(this._su);
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
			});
		};

		/**
		 * اطلاعات یک کاربر جدید را دریافت کرده و آن را به عنوان یک کاربر در سیستم ثبت می‌کند. حالت
		 * نهایی کاربر به نوع پیاده سازی سرور بستگی دارد. بر برخی از سرورها، به محض اینکه کاربر ثبت
		 * نام کرد حالت فعال رو داره و می‌تونه وارد سیستم بشه اما در برخی از سیستم‌ها نیاز به فرآیند
		 * فعال سازی دارد.
		 *
		 * پارامترهای مورد نیاز برای ایجاد کاربر هم متفاوت هست. در برخی سیستم‌ها ایمیل، نام کاربری و گذرواژه
		 * مهم است و سایر پارامترهای به صورت دلخواه خواهد بود.
		 *
		 * @memberof $usr
		 * @param  {object} detail خصوصیت‌های کاربر
		 * @return {promise(PUser)}        حساب کاربری ایجاد شده
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
			});
		};
		/**
		 * فهرست کاربران را به صورت صفحه بندی شده در اختیار قرار می‌دهد. این فهرست
		 * برای کاربردهای متفاوتی استفاده می‌شود مثل اضافه کردن به کاربران مجاز. دسترسی به فهرست
		 * کاربران تنها بر اساس سطوح امنیتی تعریف شده در سرور ممکن است و بسته به نوع پیاده سازی
		 * سرور متفاوت خواهد بود.
		 *
		 * @memberof $usr
		 * @param {PagintorParameter} parameter پارامترهای مورد استفاده در صفحه بندی نتایج
		 * @return {promise(PaginatorPage)} صفحه‌ای از کاربران سیستم.
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
			});
		};

		/**
		 * اطلاعات کاربر را با استفاده از شناسه آن بازیابی می‌کند. شناسه کاربر همان نام کاربری است که
		 * کاربر با استفاده از آن می‌تواند وارد سیستم شود.
		 *
		 * @memberof $usr
		 * @param  {string} login شناسه کاربر مورد نظر
		 * @return {promise(PUser)}   اطلاعات بازیابی شده کاربر
		 */
		this.user = function(login) {
			var scope = this;
			return $http({
				method: 'GET',
				url: '/api/user/user/' + login,
			}).then(function(data) {
				return scope._ret(data.data.id, data.data);
			});
		};
	}

//End
})();
