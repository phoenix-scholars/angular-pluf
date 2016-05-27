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
