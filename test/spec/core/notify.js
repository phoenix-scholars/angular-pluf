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
describe('Core module test: $notify', function() {
  var originalTimeout;
  var $rootScope;
  var $notify;
  var $timeout;

  beforeEach(function() {
    module('pluf');
  });
  beforeEach(function (){
    inject(function(_$notify_, _$rootScope_, _$timeout_) {
      $notify = _$notify_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    });
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Check onMessage function', function () {
    expect(angular.isFunction($notify.onMessage)).toBe(true);
  });
  it('Check info function', function () {
    expect(angular.isFunction($notify.info)).toBe(true);
  });
  it('Check warning function', function () {
    expect(angular.isFunction($notify.warning)).toBe(true);
  });
  it('Check debug function', function () {
    expect(angular.isFunction($notify.debug)).toBe(true);
  });
  it('Check error function', function () {
    expect(angular.isFunction($notify.error)).toBe(true);
  });

  it('add new info', function (done){
    $notify.onMessage(function(message){
      expect(message.title).toBe('title');
      expect(message.message).toBe('message');
      expect(message.isInfo()).toBe(true);
      expect(message.isWarning()).toBe(false);
      expect(message.isDebug()).toBe(false);
      expect(message.isError()).toBe(false);
      done();
    });
    $notify.info({
      title: 'title',
      message: 'message'
    });
    $timeout.flush();
    $rootScope.$apply();
  });

  it('add new warning', function (done){
    $notify.onMessage(function(message){
      expect(message.title).toBe('title');
      expect(message.message).toBe('message');
      expect(message.isInfo()).toBe(false);
      expect(message.isWarning()).toBe(true);
      expect(message.isDebug()).toBe(false);
      expect(message.isError()).toBe(false);
      done();
    });
    $notify.warning({
      title: 'title',
      message: 'message'
    });
    $timeout.flush();
    $rootScope.$apply();
  });


  it('add new debug', function (done){
    $notify.onMessage(function(message){
      expect(message.title).toBe('title');
      expect(message.message).toBe('message');
      expect(message.isInfo()).toBe(false);
      expect(message.isWarning()).toBe(false);
      expect(message.isDebug()).toBe(true);
      expect(message.isError()).toBe(false);
      done();
    });
    $notify.debug({
      title: 'title',
      message: 'message'
    });
    $timeout.flush();
    $rootScope.$apply();
  });

  it('add new error', function (done){
    $notify.onMessage(function(message){
      expect(message.title).toBe('title');
      expect(message.message).toBe('message');
      expect(message.isInfo()).toBe(false);
      expect(message.isWarning()).toBe(false);
      expect(message.isDebug()).toBe(false);
      expect(message.isError()).toBe(true);
      done();
    });
    $notify.error({
      title: 'title',
      message: 'message'
    });
    $timeout.flush();
    $rootScope.$apply();
  });


  it('new info message action', function (done){
    $notify.onMessage(function(message){
      expect(message.title).toBe('title');
      expect(message.message).toBe('message');
      expect(message.isInfo()).toBe(true);
      expect(message.isWarning()).toBe(false);
      expect(message.isDebug()).toBe(false);
      expect(message.isError()).toBe(false);
      message.action();
      // done();
    });
    $notify.info({
      title: 'title',
      message: 'message',
      action: function() {
        done();
      }
    });
    $timeout.flush();
    $rootScope.$apply();
  });

});
