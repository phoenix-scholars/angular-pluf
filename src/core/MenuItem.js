/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PMenuItem',[
       '$window', '$act', PMenuItem
    ]);

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
        var args = [menu.command];
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
  }

})(window.angular);
