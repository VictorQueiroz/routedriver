describe('Router', function() {
	var router,
			routes;

	beforeEach(function() {
		routes = {};
		router = new Router(routes);
	});

	describe('when()', function() {
		it('should define a route path', function() {
			var route = { templateUrl: 'home.html' };

			router.when('/home', route);

			expect(routes['/home']).toBe(route);
		});
	});

	describe('parse()', function() {
		it('should find the route by the given path', function() {
			var route1 = {},
					route2 = {};

			router
				.when('/a/{id}', route1)
				.when('/a/{name}/c/{id}', route2);

			expect(router.parse('/a/1')).toBe(route1);
			expect(router.parse('/a/RouterParam/c/1')).toBe(route2);
		});
	});

	describe('prepare()', function() {
		it('should put a route on the prepared queue to be commited', function() {
			var route = {};

			router.when('/a1', route);
			router.prepare(router.parse('/a1'));

			expect(router.preparedRoute).toBe(route);
		});

		it('should emit routeChangeStart event', function() {
			var route = {};
			var listenerSpy = jasmine.createSpy();

			router.on('routeChangeStart', listenerSpy);
			router.when('/a2', route);
			router.prepare(router.parse('/a2'));

			expect(listenerSpy).toHaveBeenCalledWith(route, null);
		});
	});

	describe('constructor()', function() {
		describe('createPathRegExp()', function() {
			it('should create a special regular expression to match a url path and it\'s parameters', function() {
				var regexp = Router.createPathRegExp('/a/b/c/e/d/f/{a}/b/{c}').regexp;

				expect(regexp.test('/a/b/c/e/d/f/2014-03-10/b/100')).toBeTruthy();
				expect(regexp.test('/a/b/c/e/x/f/2014-03-10/b/100')).not.toBeTruthy();
				expect(regexp.test('/a/x/c/e/x/f/2014-03-10/b/100')).not.toBeTruthy();
			});

			it('should accept conditional parameters', function() {
				var regexp = Router.createPathRegExp('/a/{d?}').regexp;

				expect(regexp.test('/a')).toBeTruthy();
				expect(regexp.test('/a/4')).toBeTruthy();
			});
		});
	});
});