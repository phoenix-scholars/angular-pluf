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
});
