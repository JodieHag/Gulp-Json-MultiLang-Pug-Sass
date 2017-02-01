var gulp = require('gulp');
// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
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
        'index': 'index',
        'form': 'form',
        'gracias': 'gracias'
    }
};

//lint JS
gulp.task('lint', function() {
    return gulp.src('dev/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile sass to css, concat and minify
gulp.task('sass', function() {
    return gulp.src('dev/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        // .pipe(concat('styles.css')) //los mete todos en el mismo archivo
        // .pipe(cssmin()) //minimiza los css
        // .pipe(rename({
        //     suffix: '.min'
        // })) //renombra
        .pipe(gulp.dest('www/css'));
});



//compile pug to html and translate
gulp.task('pug', ['statics', 'scripts'], function() {

    var translations = [];


    for (var lang in projectSettings.langs) {
        for (var page in projectSettings.pages) {
            translations.push(gulp.src('dev/pug/' + projectSettings.pages[page] + '.pug')
                .pipe(pug({
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
            'dev/js/*.js'
        ])
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('www/js'));
});

// Concatenate & Minify Vendor
gulp.task('vendor', function() {
    return gulp.src([
            'dev/js/vendor/**/*.*'
        ])
        //.pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('www/js/vendor'));
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

// Concatenate & Minify JS
gulp.task('vendor', function() {
    return gulp.src([
            'dev/js/vendor/**/*.*'
        ])
        //.pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('www/js/vendor'));
});
//Json Errors Files
gulp.task('json', function() {
    for (var lang in projectSettings.langs) {
        return gulp.src([
                'dev/i18n/' + projectSettings.langs[lang] + '/errormessage.json'
            ])
            .pipe(gulp.dest('www/i18n/' + projectSettings.langs[lang]));
    }
});
//css
gulp.task('css', function() {
    return gulp.src([
            'dev/css/**/*.*'
        ])
        //.pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('www/css'));
});
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('dev/js/vendor/**/*.js', ['lint', 'vendor']);
    gulp.watch('dev/js/*.js', ['lint', 'scripts']);
    gulp.watch('dev/js/components/*.js', ['lint', 'scripts']);
    gulp.watch('dev/sass/*/*.*', ['sass']);
    gulp.watch(['dev/pug/*.pug', 'dev/pug/**/*.pug'], ['pug']);
    gulp.watch('dev/pug/partials/*.pug', ['pug']);
    for (var lang in projectSettings.langs) {
        gulp.watch('dev/i18n/' + projectSettings.langs[lang] + '/*.json', ['json']);
    }
});

//init http server
gulp.task('connect', function() {
    connect.server({
        root: "www",
        port: 8080
    });
});
//
gulp.task('zip', () => {
    return gulp.src('www/**/*.*')
        .pipe(zip('zip-test.zip'))
        .pipe(gulp.dest('dist'));
});
// Default Task
gulp.task('default', ['sass', 'css', 'scripts', 'vendor', 'json', 'statics', 'pug', 'watch', 'connect']);
gulp.task('dist', ['zip']);
