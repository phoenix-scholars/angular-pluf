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
