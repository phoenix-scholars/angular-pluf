'use strict';

/**
 * تمام کارهایی که توی نرم‌افزار ساختمان مورد نیاز است رو با این ماژول انجام
 * می‌دیم.
 */
angular.module('pluf.hm', ['pluf', 'pluf.saas'])
/**
 * واحد‌های یک ساختمان را با استفاده از این ساختار داده‌ای تعریف می‌کنیم. این
 * واحد امکانات متفاوتی مانند پرداخت‌ها و یا اطلاعات واحد را در اختیار می‌گذارد.
 */
.factory('HMPart', function(PObject) {
  var hMPart = function() {
    PObject.apply(this, arguments);
  };
  hMPart.prototype = new PObject();
  return hMPart;
})
/**
 * پرداخت عبارت است از یک هزینه که باید توسط هر واحد انجام شود. این پرداخت‌ها
 * موجودیت‌هایی برای مدیریت هزینه‌ها هستند
 */
.factory('HMPayment', function(PObject) {
  var hMPayment = function() {
    PObject.apply(this, arguments);
  };
  hMPayment.prototype = new PObject();
  return hMPayment;
})
/**
 * پیام‌هایی که در برد هر ساختمان ایجاد می‌شود با استفاده از این ساختار داده‌ای
 * ایجاد و مدیریت می‌شوند. هر ساختمان یک فهرست از این پیام‌ها را دارد
 */
.factory('HMMessage', function(PObject) {
  var hMMessage = function() {
    PObject.apply(this, arguments);
  };
  hMMessage.prototype = new PObject();
  return hMMessage;
})
/**
 * در این نرم افزار هر حوزه به عنوان یک ساختمان در نظر گرفته می‌شود که در آن
 * موجودیت‌هایی مانند واحد، پیام‌های روی برد پرداخت‌ها و مدیریت تعریف شده است.
 */
.factory(
        'HMTenant',
        function($http, PException, PaginatorPage, PaginatorParameter, PTenant,
                HMPart, HMMessage) {
          var hMTenant = function() {
            PTenant.apply(this, arguments);
            this._message = [];
            this._part = [];
          };
          hMTenant.prototype = new PTenant();
          hMTenant.prototype.retMsg = function(d) {
            if (d.id in this._message) {
              var t = this._message[d.id];
              t.setData(d);
              return t;
            }
            var t = new HMMessage(d);
            this._message[t.id] = t;
            return t;
          }
          hMTenant.prototype.retPart = function(d) {
            if (d.id in this._part) {
              var t = this._part[d.id];
              t.setData(d);
              return t;
            }
            var t = new HMPart(d);
            this._part[t.id] = t;
            return t;
          }
          hMTenant.prototype.messages = function(param) {
            if (!param) {
              param = new PaginatorParameter();
            }
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/hm/' + this.id + '/message/list',
              params: param.getParameter(),
            }).then(function(res) {
              var page = new PaginatorPage(res.data);
              page.items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope.retMsg(res.data.items[i]);
                page.items.push(t);
              }
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
          hMTenant.prototype.parts = function(param) {
            if (!param) {
              param = new PaginatorParameter();
            }
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/hm/' + this.id + '/part/list',
              params: param.getParameter(),
            }).then(function(res) {
              var page = new PaginatorPage(res.data);
              page.items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope.retPart(res.data.items[i]);
                page.items.push(t);
              }
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
          return hMTenant;
        })
/**
 * این سرویس دسترسی‌های پایه به آپارتمان‌ها را فراهم می‌کند و امکانات اولیه برای
 * ایجاد و جستجوی آنها را در اختیار می‌گذارد.
 */
.service('$hm', function($tenant, HMTenant) {
  angular.extend(this, $tenant);
  this.ret = function(d) {
    if (d.id in this._tenant) {
      var t = this._tenant[d.id];
      t.setData(d);
      return t;
    }
    var t = new HMTenant(d);
    this._tenant[t.id] = t;
    return t;
  }
})
