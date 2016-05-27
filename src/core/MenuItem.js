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
