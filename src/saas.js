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
	.commandHandler({
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
	.commandHandler({
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
