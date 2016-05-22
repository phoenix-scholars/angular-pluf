'use strict';

/**
 * @ngdoc module
 * @name pluf.help
 * 
 * @description
 * ماژول pluf.help مجموعه‌ای از امکانات را برای پیاده‌سازی یک ویکی فراهم می‌کند.
 * عناصر اصلی این ماژول Page و Book است و عملیاتی مدیریت آن‌ها مانند ایجاد، ویرایش، حذف و دریافت 
 * آنها در این ماژول قرار داده شده است.
 */
angular.module('pluf.help', ['pluf'])

/**
 * @memberof pluf.help
 * @ngdoc factory
 * @name PWikiPageItem
 * 
 * @description
 * ساختار داده‌ای یک آیتم از نوع صفحه با کمترین اطلاعات ممکن.
 * 
 * @attr {Integer} id شناسه PageItem
 * 
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 * 
 * @attr {String} title عنوان صفحه
 * @attr {String} state وضعیت صفحه
 * 
 */
.factory('PWikiPageItem', function(PObject) {
  var wikiPageItem = function(d) {
    if (d) {
      this.setData(d);
    }
  };
  wikiPageItem.prototype = new PObject();
  /**
   * این PageItem را به‌روزرسانی می‌کند
   * 
   * @memberof PWikiPageItem.prototype
   * @param {struct} data - ساختاری حاوی اطلاعاتی که باید در صفحه به‌روزرسانی شود
   * @returns 
   */
  wikiPageItem.prototype.update = function(data) {
    this.setData(data);
    return this;
  }
  return wikiPageItem;
})

/**
 * @memberof pluf.help
 * @ngdoc factory
 * @name PWikiPage
 * 
 * @description
 * ساختار داده‌ای یک صفحه به همراه اطلاعات کامل صفحه.
 * 
 * @attr {Integer} id شناسه صفحه
 * 
 * @attr {Integer} priority
 * با این خصوصیت می‌توان برای فهرستی از صفحات یک ترتیب در نظر گرفت
 * 
 * @attr {String} title عنوان صفحه 
 * @attr {String} state وضعیت صفحه
 * @attr {Integer} book شناسه کتابی که این صفحه متعلق به آن است 
 * @attr {String} language زبان مورد استفاده در متن صفحه 
 * @attr {String} summary خلاصه‌ای از متن صفحه
 * @attr {Blob} content محتوای صفحه
 * 
 * @attr {String} content_type
 * نوع متن صفحه. مثلا: text/html, text/plain, text/markdown , ...
 * 
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد page
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory('PWikiPage', function(PObject) {
  var wikiPage = function(d) {
    if (d) {
      this.setData(d);
    }
  };
  
  wikiPage.prototype = new PObject();
  
  /**
   * اطلاعات یک صفجه را به‌روزرسانی می‌کند.
   * 
   * @memberof PWikiPage.prototype
   * @param {struct} p ساختاری حاوی اطلاعاتی از صفحه که باید به‌روزرسانی شود
   */
  wikiPage.prototype.updatePage = function(p) {
      var scope = this;
      return $http({
        method: 'POST',
        url: '/api/wiki/page/' + p.id,
        data: $httpParamSerializerJQLike(p),
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
  
  /**
   * محتوای صفحه را به قالب html تبدیل می‌کند.
   * 
   * @memberof PWikiPage.prototype
   * @returns {String} محتوای صفحه در قالب html
   */
  wikiPage.prototype.toHTML = function() {
    return markdown.toHTML(this.content);
  }
  return wikiPage;
})

/**
 * @memberof pluf.help
 * @ngdoc factory
 * @name PWikiBook
 * 
 * @description
 * ساختار داده‌ای یک کتاب به همراه اطلاعات کامل صفحه.
 * 
 * @attr {Integer} id شناسه کتاب
 * @attr {String} title عنوان کتاب
 * @attr {String} state وضعیت کتاب
 * @attr {String} language زبان مورد استفاده در متن صفحات کتاب
 * @attr {String} summary خلاصه یا توضیحی کوتاه در مورد کتاب
 * @attr {Datetime} creation_dtime تاریخ و زمان ایجاد کتاب
 * @attr {Datetime} modif_dtime تاریخ و زمان آخرین به‌روزرسانی
 */
.factory(
        "PWikiBook",
        function(PObject, PException, PWikiPageItem, PaginatorPage, $http, $q,
                $timeout) {
          var pWikiBook = function() {
            PObject.apply(this, arguments);
          };
          pWikiBook.prototype = new PObject();
          /**
           * @private
           * @param id شناسه کتاب
           * @param data داده‌های کتاب
           * @returns {PWikiPageItem}
           */
          pWikiBook.prototype._retItem = function(id, data) {
              var item = null;
              for ( var i in this.items) {
                if (this.items[i].id == id) {
                  item = this.items[i];
                  break;
                }
              }
              if (!item) {
                item = new PWikiPageItem(data);
                this.items.push(item);
              }
              item.setData(data);
              return item;
            }
          /**
           * اولین صفحه کتاب را برمی‌گرداند
           * 
           * @memberof PWikiPage.prototype
           */
          pWikiBook.prototype.getFirstPage = function() {
            var def = $q.defer();
            var scope = this;
            $timeout(function() {
              def.resolve(scope.items[0]);
            }, 1);
            return def.promise;
          }
          /**
           * فهرستی از صفحات کتاب را برمی‌گرداند
           * 
           * @memberof PWikiPage.prototype
           * @returns فهرستی از صفحات کتاب را برمی‌گرداند
           */
          pWikiBook.prototype.pages = function() {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/wiki/book/' + scope.id + '/pages',
            }).then(function(res) {
              scope.items = [];
              for (var i = 0; i < res.data.length; i++) {
                scope._retItem(res.data[i].id, res.data[i]);
              }
              return scope.items;
            }, function(data) {
              throw new PException(data);
            });
          }
          /**
           * یک صفحه را به یک کتاب اضافه می‌کند
           * 
           * @memberof PWikiBook.prototype
           * @param {PWikiPage} page صفحه‌ای که به کتاب اضافه خواهد شد
           * @returns خود کتاب را که صفحه جدید به آن اضافه شده است برمی‌گرداند
           */
          pWikiBook.prototype.addPage = function(page) {
        	if(page.isAnonymous()){
        		var dif = $q.defer();
        		$timeout(function(){
        			var ex = new PException({message:"Page id is null!"});
        			dif.reject(ex);
        		}, 1);
        		return dif.promise;
        	}
            var scope = this;
            return $http({
              method: 'POST',
              url: '/api/wiki/book/' + scope.id + '/page/' + page.id,
            }).then(function(res) {
              return scope;
            }, function(data) {
              throw new PException(data);
            });
          }
          
          /**
           * اطلاعات یک کتاب را به‌روزرسانی می‌کند.
           * 
           * @memberof PWikiBook.prototype
           * @param {struct} b ساختاری حاوی اطلاعاتی از کتاب که باید به‌روزرسانی شود
           */
          pWikiBook.prototype.update = function(b) {
            var scope = this;
            return $http({
              method: 'POST',
              url: '/api/wiki/book/' + scope.id,
              data: $httpParamSerializerJQLike(b),
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
          
          return pWikiBook;
        }
)

/**
 * @memberof pluf.help
 * @ngdoc service
 * @name $help
 * 
 * @description
 * این سرویس امکانات مدیریت صفحه‌ها و کتاب‌های ویکی را فراهم می‌کند. با استفاده از این سرویس
 * می‌توان صفحات و کتاب‌های ویکی را ایجاد، حذف، جستجو و یا دریافت کرد.
 */
.service(
        '$help',
        function($http, $httpParamSerializerJQLike, $q, PException, PWikiPage,
                PWikiBook, PaginatorPage) {
          /*
           * کار با صفحه‌ها
           */
          /** @private */
          this._ppage = {}
          /** @private */
          this._getPage = function(id) {
            return this._ppage[id];
          }
          /** @private */
          this._setPage = function(page) {
            this._ppage[page.id] = page;
          }
          /** @private */
          this._retPage = function(id, data) {
            var instance = this._getPage(id);
            if (instance) {
              instance.setData(data);
            } else {
              instance = new PWikiPage(data);
              this._setPage(instance);
            }
            return instance;
          }

          /*
           * کار با کتابها
           */
          /** @private */
          this._pbook = {}
          /** @private */
          this._getBook = function(id) {
            return this._pbook[id];
          }
          /** @private */
          this._setBook = function(page) {
            this._pbook[page.id] = page;
          }
          /** @private */
          this._retBook = function(id, data) {
            var instance = this._getBook(id);
            if (instance) {
              instance.setData(data);
            } else {
              instance = new PWikiBook(data);
              this._setBook(instance);
            }
            return instance;
          }

          /* فراخوانی‌های عمومی */
          /**
           * کتاب‌های ویکی را با توجه به پارامتر p مورد جستجو قرار می‌دهد و نتیجه را در قالب
           * یک فهرست صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
           * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
           * 
           * @memberof $help
           * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای کتاب‌های مورد جستجو تعیین می‌شود.
           * @return {PaginatorPage} ساختاری صفحه‌بندی شده از کتاب‌ها در نتیجه جستجو
           */
          this.books = function(p) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/wiki/book/find',
              params: p.getParameter(),
            }).then(function(res) {
              var page = new PaginatorPage(res.data);
              var items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope._retBook(page.items[i].id, page.items[i]);
                items.push(t);
              }
              page.items = items;
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }
          
          /**
           * کتاب با شناسه داده شده را برمی گرداند.
           * 
           * @memberof $help
           * @param {Integer} id شناسه کتاب مورد نظر
           * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب با شناسه داده شده
           */
          this.book = function(id) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/wiki/book/' + id,
            }).then(function(res) {
              var book = scope._retBook(res.data.id, res.data);
              return book;
            }, function(data) {
              throw new PException(data);
            });
          }
          
          /**
           * یک کتاب را بر اساس اطلاعات داده شده ایجاد می‌کند و کتاب ایجاد شده را
           * به صورت غیرهمزمان برمی‌گرداند.
           * 
           * @memberof $help
           * @param {PWikiBook} b کتابی که باید ذخیره شود
           * @return {PWikiBook} ساختاری حاوی اطلاعات کتاب پس از ذخیره شدن
           */
          this.createBook = function(b) {
            var scope = this;
            return $http({
              method: 'POST',
              url: '/api/wiki/book/create',
              data: $httpParamSerializerJQLike(b),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function(res) {
              var t = scope._retBook(res.data.id, res.data);
              return t;
            }, function(data) {
              throw new PException(data);
            });
          }
          
          /**
           * صفحات ویکی را با توجه به پارامتر p مورد جستجو قرار داده و صفحات نتیجه را 
           * در قالب یک ساختار صفحه‌بندی شده به صورت غیرهمزمان برمی‌گرداند.
           * پارامتر p ساختاری است که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
           * 
           * @memberof $help
           * @param {PaginatorParameter} p ساختاری که در آن خصوصیات مورد نظر برای صفحات مورد جستجو تعیین می‌شود
           * @return {PaginatorPage} ساختاری صفحه‌بندی شده از صفحات در نتیجه جستجو
           */
          this.pages = function(p) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/wiki/page/find',
              params: p.getParameter(),
            }).then(function(res) {
              var page = new PaginatorPage(res.data);
              var items = [];
              for (var i = 0; i < page.counts; i++) {
                var t = scope._retPage(page.items[i].id, page.items[i]);
                items.push(t);
              }
              page.items = items;
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }

          /**
           * صفحه با شناسه داده شده را برمی گرداند.
           * 
           * @memberof $help
           * @param {Integer} id شناسه صفحه مورد نظر
           * @return {PWikiPage} ساختاری حاوی اطلاعات صفحه با شناسه داده شده
           */
          this.page = function(id) {
            var scope = this;
            return $http({
              method: 'GET',
              url: '/api/wiki/page/' + id,
            }).then(function(res) {
              var page = scope._retPage(res.data.id, res.data);
              return page;
            }, function(data) {
              throw new PException(data);
            });
          }

          /**
           * یک صفحه را بر اساس اطلاعات داده شده ایجاد می‌کند و صفحه ایجاد شده را
           * به صورت غیرهمزمان برمی‌گرداند.
           * 
           * @memberof $help
           * @param {PWikiPage} b صفحه‌ای که باید ذخیره شود
           * @return {PWikiPage} ساختاری حاوی اطلاعات صفحه پس از ذخیره شدن
           */
          this.createPage = function(p) {
            var scope = this;
            return $http({
              method: 'POST',
              url: '/api/wiki/page/create',
              data: $httpParamSerializerJQLike(p),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(function(res) {
              var t = scope._retPage(res.data.id, res.data);
              return t;
            }, function(data) {
              throw new PException(data);
            });
          }
          
        })

/**
 * فیلتر نمایش صفحه‌ها را ایجاد می‌کند.
 */
.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});
