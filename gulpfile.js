var gulp = require('gulp');
// Include Our Plugins
var jshint  = require('gulp-jshint');
var sass = require('gulp-sass');
var jade    = require('gulp-jade');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var connect = require('gulp-connect');
var zip = require('gulp-zip');
var cssmin = require('gulp-cssmin');
var merge = require('merge-stream');

var projectSettings = {
	langs: {
		'es': 'es-ES',
		'ca': 'es-CA',
		'en': 'en-GB'
	},
	pages: {
		'index' : 'index',
		'confirmacion': 'confirmacion',
		'gracias':'gracias'
	}
};

//lint JS
gulp.task('lint', function() {
	return gulp.src('dev/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Compile sass to css, concat and minify
gulp.task('sass', function () {
  return gulp.src('dev/sass/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('styles.css'))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('www/css'));
});



//compile jade to html and translate
gulp.task('jade', ['statics', 'scripts'], function() {

	var translations = [];


	for (var lang in projectSettings.langs) {
		for (var page in projectSettings.pages) {
			translations.push(gulp.src('dev/jade/' + projectSettings.pages[page] + '.jade')
				.pipe(jade({
					locals: {
						i18n: require('./dev/i18n/' + projectSettings.langs[lang] + '/translation.json'),
						lang: lang
					}
				}))
				.pipe(rename({
					basename: projectSettings.pages[page] + '_' + lang
				}))
				.pipe(gulp.dest('www'))
			);
		}
	}


});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src([
		'dev/js/vendor/jquery-1.12.1.min.js',
		'dev/js/vendor/jquery-ui.min.js',
		'dev/js/vendor/jquery-datepicker-langs.js',
		'dev/js/vendor/jquery.tooltipster.js',
		'dev/js/vendor/jquery.easings.js',
		'dev/js/vendor/select2.min.js',
		'dev/js/vendor/velocity.min.js',
		'dev/js/vendor/mobile-detect.min.js',
		'dev/js/cookies.js',
		'dev/js/main.js'
		])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('www/js'));
});


//copy statics && external css
gulp.task('statics', function() {
	var media = gulp.src('dev/media/**/*.*')
		.pipe(gulp.dest('www/media'));

	var pdf = gulp.src('dev/pdf/**/*.*')
		.pipe(gulp.dest('www/pdf'));

	var css = gulp.src('dev/css/**/*.*')
		.pipe(gulp.dest('www/css'));


	return merge(media, pdf, css);

});


// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('dev/js/*.js', ['lint', 'scripts']);
	gulp.watch('dev/sass/*/*.*', ['sass']);
	gulp.watch('dev/jade/*.jade', ['jade']);
});

//init http server
gulp.task('connect', function() {
	connect.server({
		root:"www",
		port:8080
	});
});
//
gulp.task('zip', () => {
	return gulp.src('www/*')
		.pipe(zip('zip-test.zip'))
		.pipe(gulp.dest('dist'));
});
// Default Task
gulp.task('default', ['sass', 'scripts', 'statics', 'jade', 'watch', 'connect']);
gulp.task('dist', ['zip']);

