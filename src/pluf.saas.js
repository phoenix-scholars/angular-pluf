'use strict';
angular.module('pluf.saas', ['pluf'])
/*******************************************************************************
 * PApplication
 * =============================================================================
 * هر نسخه می‌تواند از یک نوع نرم افزار خاص نصب شده استفاده کند. البته نرم
 * افزارهای باید تنها از خدمات ارائه شده در نسخه نصبی استفاده کنند. هر نرم افزار
 * می‌تواند شامل تنظیم‌های متفاتی باشد.
 ******************************************************************************/
.factory(
        'PApplication',
        function($http, $q, $window, PObject) {
          var pApplication = function() {
            PObject.apply(this, arguments);
          };
          pApplication.prototype = new PObject();

          pApplication.prototype.setTenant = function($t) {
            this._tenant = $t;
            return this;
          }
          pApplication.prototype.run = function() {
            $window.location = $window.location.origin + '/' + this._tenant.id
                    + '/' + this.id;
          }

          return pApplication;
        })

/*******************************************************************************
 * PTenant
 * =============================================================================
 * ساختار داده‌ای یک ملک را تعیین می‌کنه
 ******************************************************************************/
.factory(
        'PTenant',
        function($http, $httpParamSerializerJQLike, $location, $window, $q,
                PObject, PException, PProfile, PApplication, PaginatorPage) {
          var pTenant = function() {
            PObject.apply(this, arguments);
          };
          pTenant.prototype = new PObject();

          pTenant.prototype._pool = [];
          pTenant.prototype.ret = function(d) {
            if (d.id in this._pool) {
              var t = this._pool[d.id];
              t.setData(d);
              return t;
            }
            var t = new PApplication(d).setTenant(this);
            this._pool[t.id] = t;
            return t;
          }
          pTenant.prototype.update = function(key, value) {
            var scope = this;
            var par = {};
            par[key] = value;
            return $http({
              method: 'POST',
              url: '/api/saas/app/' + this.id,
              data: $httpParamSerializerJQLike(par),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function(res) {
              scope.setData(res.data);
              return scope;
            }, function(data) {
              throw new PException(data);
            });
          }
          /*
           * اعضای یک نرم‌افزار کاربردی را تعیین می‌کند.
           */
          pTenant.prototype.members = function() {
            if (this.isAnonymous() || this.memberLoaded()) {
              var deferred = $q.defer();
              if (this.isAnonymous())
                deferred.reject('authentication requried');
              else
                deferred.resolve(this._member);
              return deferred.promise;
            }
            var scope = tenantService;
            return $http({
              method: 'GET',
              url: '/api/saas/app/' + $application.id + '/member/list'
            }).then(function(res) {
              scope.$member.setData(res.data);
              return scope.$member;
            }, function(data) {
              throw new PException(data);
            });
          }
          /*
           * فهرست تمام نرم‌افزارهایی را تعیین می‌کند که این ناحیه حق استفاده از
           * آنها را دارد.
           */
          pTenant.prototype.apps = function($params) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/saas/app/' + this.id + '/sap/list',
              params: $params.getParameter(),
            }).then(function(res) {
              var page = new PaginatorPage(res.data);
              var items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope.ret(page.items[i]);
                items.push(t);
              }
              page.items = items;
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
          pTenant.prototype.run = function() {
            // XXX: maso, 1394: Check domain, subdomain and id
            $window.location = $window.location.origin + '/' + this.id;
          }

          return pTenant;
        })

/*******************************************************************************
 * $tenant
 * =============================================================================
 * یک نسخه نصب شده از نرم افزار را تعیین می‌کند که شامل دسته از کاربران،
 * تنظیم‌ها، و داده‌ها می‌شود.
 ******************************************************************************/
.service(
        '$tenant',
        function($http, $httpParamSerializerJQLike, $q, $act, $usr, $window,
                PTenant, PApplication, PException, PaginatorParameter,
                PaginatorPage) {
          this._pool = [];
          this.ret = function(d) {
            if (d.id in this._pool) {
              var t = this._pool[d.id];
              t.setData(d);
              return t;
            }
            var t = new PTenant(d);
            this._pool[t.id] = t;
            return t;
          }
          /*
           * نمونه جاری را تعیین می‌:ند
           */
          this.session = function() {
            var scope = this;
            return $http.get('/api/saas/app').then(function(res) {
              return scope.ret(res.data);
            }, function(res) {
              throw new PException(res.data);
            });
          }
          /*
           * tenant با شناسه مورد نظر را تعیین می‌کند.
           */
          this.get = function(id) {
            var scope = this;
            return $http.get('/api/saas/app/' + id).then(function(res) {
              return scope.ret(res.data);
            }, function(res) {
              throw new PException(res.data);
            });
          }
          /*
           * با استفاده از این فراخوانی یکی نرم افزار کاربردی جدید ایجاد می‌شود.
           */
          this.create = function(t) {
            var scope = this;
            return $http({
              method: 'POST',
              url: '/api/saas/app/create',
              data: $httpParamSerializerJQLike(t),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function(res) {
              return scope.ret(res.data);
            }, function(res) {
              throw new PException(res.data);
            });
          }
          /*
           * فهرست را تعینن می‌کند
           */
          this.tenants = function($params) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/saas/app/list',
              params: $params.getParameter(),
            }).then(function(res) {
              // XXX: maso, 1394: Create list of tenant object
              var page = new PaginatorPage(res.data);
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
          /*
           * فهرست نرم افزارهای کاربر را تعیین می‌کند
           */
          this.mine = function(param) {
            if (!param) {
              param = new PaginatorParameter();
            }
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/saas/app/userList',
              params: param.getParameter(),
            }).then(function(res) {
              // XXX: maso, 1394: Create list of tenant object
              var page = new PaginatorPage(res.data);
              var items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope.ret(page.items[i]);
                items.push(t);
              }
              page.items = items;
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
        })
/*******************************************************************************
 * Configurations
 * =============================================================================
 * تنظیم‌های کلی این بسته اینجا انجام می‌شود.
 ******************************************************************************/
.run(
        function($window, $act, $tenant) {
          /**
           * اضافه کردن دستورها و دستگیره‌ها
           */
          $act.command({
            id: 'pluf.saas.lunch',
            label: 'application',
            description: 'go to an application page',
            category: 'saas',
          }).commandHandler(
                  {
                    commandId: 'pluf.saas.lunch',
                    handle: function() {
                      if (arguments.length < 1) { throw new PException(
                              'application id is not defined'); }
                      var a = arguments[0];
                      return $tenant.get(a).then(function(tenant) {
                        return tenant.defaultApplication();
                      }).then(function(app) {
                        return app.run();
                      });
                    }
                  });
        });
