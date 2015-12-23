var EventEmitter = eventemitter.EventEmitter;

function Router(routes) {
	EventEmitter.call(this);

	this.routes = routes || {};
	this.current = null;
	this.preparedRoute = null;
}

Router.createPathRegExp = function(path, opts) {
	opts = opts || {};

	var insensitive = opts.caseInsensitiveMatch,
		  ret = {
		    originalPath: path,
		    regexp: path
		  },
		  params = ret.params = [];

	path = path
	.replace(/([().])/g, '\\$1')
	.replace(/(\/)?{(\w+)([\?\*])?}/g, function(_, slash, key, option) {
	  var optional = option === '?' ? option : null;
	  var star = option === '*' ? option : null;
	  params.push({ name: key, optional: !!optional });
	  slash = slash || '';
	  return ''
	    + (optional ? '' : slash)
	    + '(?:'
	    + (optional ? slash : '')
	    + (star && '(.+?)' || '([^/]+)')
	    + (optional || '')
	    + ')'
	    + (optional || '');
	})
	.replace(/([\/$\*])/g, '\\$1');

	ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');

	return ret;
};

inherits(Router, EventEmitter, {
	constructor: Router,

	when: function(path, route) {
		var routes = this.routes;

		if(this.routes.hasOwnProperty(route)) {
			throw new Error('Redefinition of route "' + path + '"');
		} else {
			routes[path] = extend(
				route,
				Router.createPathRegExp(path)
			);
		}

		return this;
	},

	prepare: function(route) {
		var lastRoute = this.current;

		this.preparedRoute = route;

		if(this.emit('routeChangeStart', route, lastRoute)) {
			return true;
		}

		return false;
	},

	commit: function() {
		var nextRoute = this.preparedRoute;

		this.current = nextRoute;
	},

	go: function(path) {
		var route = this.parse(path);

		if(!this.prepare(route)) {
			this.emit('routeNotFound', path);
		}
	},

	// Parse route by path
	parse: function(url) {
		var route,
				paths = Object.keys(this.routes),
				match,
				routes = this.routes;

		for(var i = 0; i < paths.length; i++) {
			route = routes[paths[i]];

			if((match = url.match(route.regexp))) {
				return route;
			}
		}
	}
});
