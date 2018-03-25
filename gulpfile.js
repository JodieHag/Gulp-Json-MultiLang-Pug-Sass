const gulp = require('gulp')
// Include Our Plugins
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const zip = require('gulp-zip')
const cssmin = require('gulp-cssmin')
const merge = require('merge-stream')
const open = require('gulp-open')
const livereload = require('gulp-livereload')
const eslint = require('gulp-eslint')

const projectSettings = {
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
}

// lint JS
gulp.task('lint', () => {
  return gulp.src('dev/js/*.js')
    .pipe(eslint('./.eslintrc'))
    .pipe(eslint.format('table'))
    .pipe(eslint.failAfterError())
})

// Compile sass to css, concat and minify
gulp.task('sass', () => {
  return gulp.src('dev/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(concat('styles.css')) // los mete todos en el mismo archivo
    .pipe(cssmin()) // minimiza los css
    .pipe(rename({
      suffix: '.min'
    })) // renombra
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())
})

// compile pug to html and translate
gulp.task('pug', ['statics', 'scripts'], () => {
  var translations = []

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
        .pipe(livereload())
      )
    }
  }
})

// Open one file with default application
gulp.task('open', () => {
  gulp.src('www/index_es.html')
    .pipe(open({ uri: 'http://localhost:8080/index_es.html' }))
})

// Concatenate & Minify JS
gulp.task('scripts', ['lint'], () => {
  return gulp.src(['dev/js/*.js'])
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('www/js'))
    .pipe(livereload())
})

// Concatenate & Minify Vendor
gulp.task('vendor', () => {
  return gulp.src(['dev/js/vendor/**/*.*'])
    // .pipe(uglify())
    .pipe(gulp.dest('www/js/vendor'))
    .pipe(livereload())
})

// copy statics && external css

gulp.task('statics', () => {
  var media = gulp.src('dev/media/**/*.*')
    .pipe(gulp.dest('www/media'))
    .pipe(livereload())

  var pdf = gulp.src('dev/pdf/**/*.*')
    .pipe(gulp.dest('www/pdf'))
    .pipe(livereload())

  var css = gulp.src('dev/css/**/*.*')
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())

  return merge(media, pdf, css)
})

// Concatenate & Minify JS
gulp.task('vendor', () => {
  return gulp.src(['dev/js/vendor/**/*.*'])
    // .pipe(concat('app.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('www/js/vendor'))
    .pipe(livereload())
})

// Json

gulp.task('json', () => {
  for (var lang in projectSettings.langs) {
    return gulp.src(['dev/i18n/' + projectSettings.langs[lang] + '/errormessage.json'])
      .pipe(gulp.dest('www/i18n/' + projectSettings.langs[lang]))
      .pipe(livereload())
  }
})

// css

gulp.task('css', () => {
  return gulp.src(['dev/css/**/*.*'])
    // .pipe(concat('app.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())
})

//  Watch Files For Changes

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('dev/js/vendor/**/*.js', ['lint', 'vendor'])
  gulp.watch('dev/js/*.js', ['lint', 'scripts'])
  gulp.watch('dev/js/components/*.js', ['lint', 'scripts'])
  gulp.watch('dev/sass/*/*.*', ['sass'])
  gulp.watch(['dev/pug/*.pug', 'dev/pug/**/*.pug'], ['pug'])
  gulp.watch('dev/pug/partials/*.pug', ['pug'])
  for (var lang in projectSettings.langs) {
    gulp.watch('dev/i18n/' + projectSettings.langs[lang] + '/*.json', ['json'])
  }
})

// init http server

gulp.task('connect', () => {
  connect.server({
    root: 'www',
    port: 8080
  })
})
//
gulp.task('zip', () => {
  return gulp.src('www/**/*.*')
    .pipe(zip('zip-test.zip'))
    .pipe(gulp.dest('dist'))
})
// Default Task
gulp.task('default', ['sass', 'css', 'scripts', 'vendor', 'json', 'statics', 'pug', 'watch', 'connect', 'open'])
gulp.task('dist', ['zip'])
