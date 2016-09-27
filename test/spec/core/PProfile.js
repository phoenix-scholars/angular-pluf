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
