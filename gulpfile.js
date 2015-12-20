var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');

var footer = '\
  var routes = {};\
  window.router = {\
    Router: Router,\
    routes: routes,\
    router: new Router(routes)\
  };\
}(window));';

gulp.task('build', function() {
	gulp.src([
		'src/helpers.js',
		'src/EventEmitter.js',
		'src/Router.js'
	])
	.pipe(concat('routedriver.js'))
	.pipe(wrapper({
		header: '(function(window) {',
		footer: footer
	}))
	.pipe(uglify())
  .pipe(gulp.dest('build'));
});
