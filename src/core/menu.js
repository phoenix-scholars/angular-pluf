(function(){
	
	angular
	.module('pluf')
	.service('$menu',['$q', '$timeout', '$act', '$window', menu]);
	
	/**
	 * @memberof pluf
	 * @ngdoc service
	 * @name $menu
	 * @description
	 * مدیریت منوها را ایجاد می‌کند
	 */
	function menu($q, $timeout, $act, $window) {
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
	}
	
})();