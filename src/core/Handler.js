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
