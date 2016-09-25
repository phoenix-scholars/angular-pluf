/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Core module test: PProfile', function() {
  var originalTimeout;
  var $rootScope;
  var PProfile;
  var PUser;
  var $httpBackend;
  beforeEach(function (){
    module('pluf');
    inject(function(_PProfile_, _PUser_, _$rootScope_, _$httpBackend_) {
      PProfile = _PProfile_;
      PUser = _PUser_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
    });
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  // check to see if it has the expected function
  it('Check functions', function () {
    var profile = new PProfile();
    expect(angular.isFunction(profile.update)).toBe(true);
  });

  it('Check update.', function(done){
    var profile = new PProfile();
    profile.id = 1;
    profile.user = new PUser();
    profile.user.id = 1;
    profile.update().then(function(p){
      expect(p).not.toBeNull();
      expect(p.id).toBe(1);
      expect(p.temp).not.toBeNull();
      expect(p.xxx).toBe('xxx');
      done();
    }, function(){
      expect(false).toBe(true);
      done();
    });

    $httpBackend
      .expect('POST', '/api/user/1/profile')
      .respond(200, {
        id: 1,
        xxx:'xxx',
        temp:true
      });
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });
});
