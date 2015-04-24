

  describe('path', function () {

    function mockTemplate(templateRoute, tmpl) {
    $templateCache.put(templateRoute, tmpl || templateRoute);
  }

  function goTo(url) {
    $location.url(url);
    $rootScope.$digest();
  }

  function goFrom(url) {
    return {toState: function (state, params) {
      $location.replace().url(url); //Don't actually trigger a reload
      $state.go(state, params);
      $rootScope.$digest();
    }};
  }

  function resolve(value) {
    return {forStateAndView: function (state, view) {
      var viewDefinition = view ? $state.get(state).views[view] : $state.get(state);
      return $injector.invoke(viewDefinition.resolve[value]);
    }};
  }

  describe('when empty', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('/', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('/');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('/home', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('/home');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('otherwise', function () {
    beforeEach(mockTemplate.bind(null, 'views/404.html'));
    it('should go to the 404 state', function () {
      goTo('someNonExistentUrl');
      expect($state.current.name).toEqual('404');
    });
    it('should not change the url', function () {
      var badUrl = '/someNonExistentUrl';
      goTo(badUrl);
      expect($location.url()).toEqual(badUrl);
    });
  });
});