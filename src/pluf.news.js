'use strict';
/**
 * امکانات اولیه برای مکان‌یابی را در اختیار کاربران قرار می‌دهد.
 */
angular.module('pluf.news', ['pluf'])
/**
 * ابزارهای مورد نیاز برای یک برچسب را ایجاد می‌کند.
 */
.factory('PFollower', function(PObject, PException) {
  var pFollower = function() {
    PObject.apply(this, arguments);
  };
  pFollower.prototype = new PObject();
  return pFollower;
})

.service('$news', function($httpParamSerializerJQLike, $http, $q, PException, PFollower){

    this._df = [];
    this._getf = function(i){
      return this._df[i];
    }
    this._retf= function(id, d){
      var i = this._getf(id);
      if (i) {
        i.setData(d);
        return i;
      }
      this._df[id] = new PFollower(d);
      return this._df[id];
    }


  this.validateFollower = function(f) {
    var def = $q.defer();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(f)){
      def.resolve({
        type: 'email',
        address: f
      });
      return def.promise;
    }
    var mob = /^\+?\d{10,14}$/;
    if(mob.test(f)){
      def.resolve({
        type: 'mobile',
        address: f
      })
      return def.promise;
    }
    def.resolve({
      type: 'other',
      address: f
    })
    return def.promise;
  }

  // دنبالگرها
  this.newFollower = function(f){
    var scope = this;
    return $http({
      method: 'POST',
      url: '/api/newspaper/follower/new',
      data: $httpParamSerializerJQLike(f),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(res){
      return scope._retf(res.data.id, res.data);
    });
  }
  this.followers = function(p){}
  this.follower = function(i){}

})
