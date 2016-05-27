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
