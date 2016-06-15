/* jslint todo: true */
/* jslint xxx: true */
/* jshint -W100 */
'use strict';
describe('Core module test: $menu', function() {
  var originalTimeout;
  var $rootScope;
  var $menu;
  var $timeout;

  beforeEach(function() {
    module('pluf');
  });
  beforeEach(function (){
    inject(function(_$menu_, _$rootScope_, _$timeout_) {
      $menu = _$menu_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    });
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('Check menu function', function () {
    expect(angular.isFunction($menu.menu)).toBe(true);
  });
  it('Check addItem function', function () {
    expect(angular.isFunction($menu.addItem)).toBe(true);
  });

  it('Get a sample menu', function (done){
    $menu.menu('main:toolbar').then(function(menu){
      expect(menu).not.toBeNull();
      expect(menu.id).toBe('main:toolbar');
      expect(menu.tags.length).toBe(0);
      expect(menu.items.length).toBe(0);
      done();
    });
    $timeout.flush();
    $rootScope.$apply();
  });

  it('Add action in menu and run', function (done){
    $menu.addItem('test:menu2', {
      label: 'Action menu',
      action: function(){
        done();
      }
    }).menu('test:menu2').then(function(menu){
      expect(menu).not.toBeNull();
      expect(menu.id).toBe('test:menu2');
      expect(menu.tags.length).toBe(0);
      expect(menu.items.length).toBe(1);
      menu.items.forEach(function(item){
        item.active();
      });
    });
    $timeout.flush();
    $rootScope.$apply();
  });
});
