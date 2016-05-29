// XXX: maso, 1395: پیاده سازی تست‌ها برای مدیریت محتوی
// TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('Core module test: $cms', function() {
  var originalTimeout;
  var $rootScope;
  var $cms;
  // excuted before each "it" is run.
  beforeEach(function (){
    // load the module.
    module('pluf');
    // inject your service for testing.
    // The _underscores_ are a convenience thing
    // so you can have your variable name be the
    // same as your injected service.
    inject(function(_$cms_, _$rootScope_, _$httpBackend_) {
      $cms = _$cms_;
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
  // Check functions for Content
  it('Check newContent function', function () {
    expect(angular.isFunction($cms.newContent)).toBe(true);
  });
  it('Check content function', function () {
    expect(angular.isFunction($cms.content)).toBe(true);
  });
  it('Check contents function', function () {
    expect(angular.isFunction($cms.contents)).toBe(true);
  });
  // Check functions for namedContent
  it('Check newNamedContent function', function () {
    expect(angular.isFunction($cms.newNamedContent)).toBe(true);
  });
  it('Check namedContent function', function () {
    expect(angular.isFunction($cms.namedContent)).toBe(true);
  });

  it('Check namedContents function', function () {
    expect(angular.isFunction($cms.namedContents)).toBe(true);
  });

  // Test functions
  it('New content', function (done) {
    $cms.newContent({
      title: 'content title',
      description: 'content description'
    }).then(function(content) {
      expect(content.hasOwnProperty('id')).toBe(true);
      expect(content).not.toBeNull();
      expect(content.id).not.toBeUndefined();
      expect(content.id).not.toBe(0);
      expect(content.title).toBe('content title');
      expect(content.description).toBe('content description');
      done();
    });
    $httpBackend
      .expect('POST', '/api/saascms/content/new')
      .respond(200, { id: '1', title:'content title', description:'content description' });
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });

});
