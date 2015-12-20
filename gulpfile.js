var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');

gulp.task('build', function() {
	gulp.src([
		'helpers.js',
		'EventEmitter.js',
		'Router.js'
	])
	.pipe(concat('routedriver'))
	.pipe(wrapper({
		header: '(function() {',
		footer: '\
      var routes = {};\
      window.router = {\
				Router: Router,
        routes: routes,
        router: new Router(routes)
			};\
		}());'
	}))
	.pipe(uglify());
});
