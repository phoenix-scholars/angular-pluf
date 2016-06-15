/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
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
