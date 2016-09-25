/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';

describe('Core module test: PUser', function() {
  var originalTimeout;
  var $rootScope;
  var PUser;
  var $httpBackend;
  // excuted before each "it" is run.
  beforeEach(function (){
    // load the module.
    module('pluf');
    // inject your service for testing.
    // The _underscores_ are a convenience thing
    // so you can have your variable name be the
    // same as your injected service.
    inject(function(_PUser_, _$rootScope_, _$httpBackend_) {
      PUser = _PUser_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
    });
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  // check to see if it has the expected function
  it('Check functions', function () {
    var user = new PUser();
    expect(angular.isFunction(user.profile)).toBe(true);
    expect(angular.isFunction(user.update)).toBe(true);
  });

  it('Check load profile.', function(done){
    var user = new PUser();
    user.id = 1;
    user.profile().then(function(profile){
      expect(profile).not.toBeNull();
      expect(profile.id).not.toBeNull();
      expect(profile.user).not.toBeNull();
      done();
    }, function(){
      expect(false).toBe(true);
      done();
    });

    $httpBackend
      .expect('GET', '/api/user/1/profile')
      .respond(200, { id: '1', name:'admin', administrator:true });
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });

  it('Check update.', function(done){
    var user = new PUser();
    user.id = 1;
    user.first_name = 'xxx';
    user.update().then(function(user){
      expect(user).not.toBeNull();
      expect(user.id).toBe(1);
      expect(user.temp).not.toBeNull();
      expect(user.first_name).toBe('yyy');
      done();
    }, function(){
      expect(false).toBe(true);
      done();
    });

    $httpBackend
      .expect('POST', '/api/user/1/account')
      .respond(200, {
        id:1,
        first_name:'yyy',
        temp:true
      });
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });
});
