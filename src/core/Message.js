/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
(function(angular){
  angular
    .module('pluf')
    .factory('PMessage',[
      PMessage
    ]);

  /**
   * @memberof pluf
   * @ngdoc factory
   * @name PMessge
   * @description
   * یکی از سرویس‌هایی که در این بسته ارائه شده است، سیستم انتشار پیام است. این سیستم پیام‌های
   * کاربران دریافت و آنها را در قالب این کلاس منتشر می‌کند. این کلاس یک سری ابزارهای کاربردی
   * برای کار با این نوع پیام‌ها در اختیار سایر سیستم‌ها قرار می‌دهد.
   *
   */
  function PMessage() {
    var pMessage  = function(data) {
      if (data) {
        this.setData(data);
      }
    };
    /**
     * ساختار اولیه داده را در این کلاس ایجاد می‌کند.
     *
     * @memberof PMessage
     * @param  {object} data ساختار داده اولیه برای ایجاد دستور
     * @return {PMessage}  خود دستور به عنوان نتیجه برگردانده می‌ود.
     */
    pMessage.prototype.setData = function(data) {
     angular.extend(this, data);
     return this;
    };

    /**
     * تعیین می‌کند که آیا نوع پیام معمولی است
     * @memberof PMessage
     * @return {boolean} درستی در صورت که نوع پیام معمولی باشد.
     */
    pMessage.prototype.isInfo = function(){
      return this.type == 'info';
    };

    /**
     * تعیین می‌کند که نوع پیام رفع خطا است
     * @memberof PMessage
     * @return {boolean} درستی در صورتی که نوع پیام رفع خطا باشد
     */
    pMessage.prototype.isDebug = function(){
      return this.type == 'debug';
    };

    /**
     * تعیین می‌کند که ایا پیام از نوع اخطار است.
     * @memberof PMessage
     * @return {boolean} درستی در صورتی که نوع اخطار باشد
     */
    pMessage.prototype.isWarning = function(){
      return this.type == 'warning';
    };

    /**
     * تعیین می‌کند که آیا پیام از نوع خطا است
     * @memberof PMessage
     * @return {boolean} درستی اگر پیام یک خطا باشد
     */
    pMessage.prototype.isError = function(){
      return this.type == 'error';
    };

    return pMessage;
  }

})(window.angular);
