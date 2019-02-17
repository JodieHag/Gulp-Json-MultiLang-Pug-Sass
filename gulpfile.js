const gulp = require('gulp')
// Include Our Plugins
const log = require('fancy-log')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babel = require('gulp-babel')
const pug = require('gulp-pug')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const connect = require('gulp-connect')
const zip = require('gulp-zip')
const merge = require('merge-stream')
const open = require('gulp-open')
const livereload = require('gulp-livereload')
const eslint = require('gulp-eslint')
// importar configuración de idioma y páginas
const config = require('./config')

const projectSettings = config.defaults
log(projectSettings.langs)
// init http server
gulp.task('connect', async () => {
  await connect.server({
    root: 'www',
    port: 8080,
    livereload: true
  })
})

// lint JS
/*gulp.task('lint', () => {
  return gulp.src('dev/js/!*.js')
    .pipe(eslint('./.eslintrc'))
    .pipe(eslint.format('table'))
    .pipe(eslint.failAfterError())
})*/

// Compile sass to css, concat and minify
const plugins = [
  autoprefixer({
    browsers: [
      'last 2 versions',
      '> 1%',
      'not ie <= 9',
      'ie >= 10'
    ], // añade los prefijos para las compatibilidades con los browsers
    grid: true
  }),
  cssnano() // minimiza los css
]

// css
gulp.task('css', () => {
  return gulp.src(['dev/css/**/*.*'])
    .pipe(postcss(plugins))
    // .pipe(concat('app.min.js'))
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())
    .on('end', () => { log('css Done!') })
})

gulp.task('sass', () => {
  return gulp.src('dev/sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    // .pipe(concat('styles.css')) // los mete todos en el mismo archivo
    .pipe(rename({
      suffix: '.min'
    })) // renombra
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())
    .on('end', () => { log('sass Done!') })
})

// Concatenate & Minify JS
gulp.task('scripts', () => {
  return gulp.src(['dev/js/*.js'])
    .pipe(eslint('./.eslintrc'))
    .pipe(eslint.format('table'))
    .pipe(eslint.failAfterError())
    .pipe(babel())
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('www/js'))
    .pipe(livereload())
    .on('end', () => { log('scripts Done!') })
})

// copy statics && external css
gulp.task('statics', () => {
  var media = gulp.src('dev/media/**/*.*')
    .pipe(gulp.dest('www/media'))
    .pipe(livereload())

  var pdf = gulp.src('dev/pdf/**/*.*')
    .pipe(gulp.dest('www/pdf'))
    .pipe(livereload())

  return merge(media, pdf)
})

// compile pug to html and translate
gulp.task('pug', async () => {
  log('pug Init!')
  let translations = []
  for (const lang in projectSettings.langs) {
    for (const page in projectSettings.pages) {
      translations.push(
        await gulp.src('dev/pug/' + projectSettings.pages[page] + '.pug')
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
  log('pug Done!')
})

// Open one file with default application
gulp.task('open', async () => {
  await gulp.src('www/index_es.html')
    .pipe(open({ uri: 'http://localhost:8080/index_es.html' }))
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
  for (const lang in projectSettings.langs) {
    return gulp.src(['dev/i18n/' + projectSettings.langs[lang] + '/errormessage.json'])
      .pipe(gulp.dest('www/i18n/' + projectSettings.langs[lang]))
      .pipe(livereload())
  }
})

//  Watch Files For Changes
gulp.task('watch', async () => {
  livereload.listen()
  await gulp.watch('dev/js/vendor/**/*.js', gulp.series(['vendor']))
  await gulp.watch('dev/js/*.js', gulp.series(['scripts']))
  await gulp.watch('dev/js/components/*.js', gulp.series(['scripts']))
  await gulp.watch('dev/sass/*/*.*', gulp.series(['sass']))
  await gulp.watch(['dev/pug/*.pug', 'dev/pug/**/*.pug'], gulp.series(['pug']))
  await gulp.watch('dev/pug/partials/*.pug', gulp.series(['pug']))
  for (const lang in projectSettings.langs) {
    await gulp.watch(`dev/i18n/${projectSettings.langs[lang]}/*.json`, gulp.series(['json']))
  }
})

// generate a build dist
gulp.task('zip', () => {
  return gulp.src('www/**/*.*')
    .pipe(zip('zip-test.zip'))
    .pipe(gulp.dest('dist'))
})

gulp.task('styles', gulp.series(['sass', 'css']))
gulp.task('scripts-statics', gulp.parallel(['statics', 'scripts', 'vendor', 'json']))
gulp.task('server', gulp.series(['connect', 'watch']))
gulp.task('build', gulp.series(['styles', 'scripts-statics', 'pug', 'open']))

// Default Task
gulp.task('default', gulp.parallel(['build', 'server']))
gulp.task('dist', gulp.series(['zip']))
