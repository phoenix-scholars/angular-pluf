// XXX: maso, 1395: پیاده سازی تست‌ها برای مدیریت محتوی
// TODO: hadi, 1395: پیاده‌سازی تست‌ها در حال انجام
describe('Core module test: $cms', function() {
  var originalTimeout;
  var $rootScope;
  var $cms;
  var $timeout
  var PaginatorParameter;
  // excuted before each "it" is run.
  beforeEach(function (){
    // load the module.
    module('pluf');
    // inject your service for testing.
    // The _underscores_ are a convenience thing
    // so you can have your variable name be the
    // same as your injected service.
    inject(function(_$cms_, _$rootScope_, _$httpBackend_, _$timeout_, _PaginatorParameter_) {
      $cms = _$cms_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      $timeout = _$timeout_;
      PaginatorParameter = _PaginatorParameter_;
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
  // TODO: Hadi: این تست کامل نیست. باید ارسال فایل هم تست شود
  it('New content', function (done) {
    $cms.newContent({
      title: 'content title',
      description: 'content description'
    }).then(function(content) {
      expect(content.hasOwnProperty('id')).toBe(true);
      expect(content).not.toBeNull();
      expect(content.id).not.toBeUndefined();
      expect(content.id).toBe('1');
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

  it('Get content', function (done) {
    $cms.content(1).then(function(content) {
      expect(content.hasOwnProperty('id')).toBe(true);
      expect(content).not.toBeNull();
      expect(content.id).not.toBeUndefined();
      expect(content.id).toBe('1');
      expect(content.title).toBe('content title');
      expect(content.description).toBe('content description');
      done();
    });
    $httpBackend
      .expect('GET', '/api/saascms/content/1')
      .respond(200, { id:'1', title:'content title', description:'content description' });
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });

  it('Find contents', function(done){
    var pp = PaginatorParameter();
    pp._px_p = 2;
    pp._px_ps = 10;

    $cms.contents(pp).then(function(list){
      expect(list).not.toBeNull();
      expect(list.items).not.toBeUndefined();
      expect(list.counts).not.toBeUndefined();
      expect(list.current_page).not.toBeUndefined();
      expect(list.item_per_page).not.toBeUndefined();
      expect(list.page_number).not.toBeUndefined();

      expect(list.counts).toBe(list.items.lenght);
      expect(list.current_page).toBe(pp._px_p);
      expect(list.item_per_page).toBe(pp._px_ps);
      expect(list.page_number).toBe(3);
      done();
    });

    var fakePaginatedResult = {
      items:[
              {id:1, title:'title1', description:'description1'},
              {id:2, title:'title2', description:'description2'},
              {id:3, title:'title3', description:'description3'}
            ],
      counts:items.lenght,
      current_page:pp._px_p,
      item_per_page:pp._px_ps,
      page_number:3
    };
    $httpBackend
      .expect('POST', '/api/saascms/content/find')
      .respond(200, fakePaginatedResult);
    expect($httpBackend.flush).not.toThrow();
    $rootScope.$apply();
  });

});
