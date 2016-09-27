/*
 * Copyright (c) 2015 Phoenix Scholars Co. (http://dpq.co.ir)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
