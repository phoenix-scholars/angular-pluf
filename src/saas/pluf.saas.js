'use strict';
angular.module('pluf.saas', ['pluf'])

/*******************************************************************************
 * Configurations
 * =============================================================================
 * تنظیم‌های کلی این بسته اینجا انجام می‌شود.
 ******************************************************************************/
.run(function($window, $act, $tenant) {
  /**
   * اضافه کردن دستورها و دستگیره‌ها
   */
  $act//
  .command({
    id: 'pluf.saas.lunch',
    category: 'saas',
  }).commandHandler({
    commandId: 'pluf.saas.lunch',
    handle: function() {
      if (arguments.length < 1) {//
        throw new PException('no app found');
      }
      var a = arguments[0];
      return $tenant.get(a).then(function(tenant) {
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
  }).commandHandler({
    commandId: 'pluf.saas.app.lunch',
    handle: function() {
      if (arguments.length < 1) {//
        throw new PException('no app found');
      }
      var a = arguments[0];
      return $tenant.session().then(function(tenant) {
        return tenant.app(a);
      }).then(function(app) {
        return app.run();
      });
    }
  });
});
