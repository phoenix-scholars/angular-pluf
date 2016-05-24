/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(){
	angular
		.module('pluf')
		.service('$act',[
			'$q', '$timeout', 'PException',
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
 * فراخوانی این دستور منجر به اجرا شدن تمام دستگیره‌هایی مرتبط خواهد شد.
 */
	function act($q, $timeout, PException) {
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
		};
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
		};

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
		};

		/**
		 * اضافه کردن دستگیره.
		 */
		this.commandHandler = function($ch) {
			if (!($ch.commandId in this._handlers)) {
				this._handlers[$ch.commandId] = [];
			}
			this._handlers[$ch.commandId].push($ch);
			return this;
		};

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
				promises.push(handler.handle.apply(handler, args));
			}
			return $q.all(promises);
		};
	}

})();
