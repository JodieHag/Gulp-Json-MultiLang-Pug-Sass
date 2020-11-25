const gulp = require('gulp')
// Include Our Plugins
const autoprefixer = require('autoprefixer')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const connect = require('gulp-connect')
const critical = require('critical').stream
const cssnano = require('cssnano')
const livereload = require('gulp-livereload')
const log = require('fancy-log')
const merge = require('merge-stream')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const open = require('gulp-open')
const prettier = require('gulp-prettier')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const zip = require('gulp-zip')

// importar configuración de idioma y páginas
const config = require('./config')

const projectSettings = config.defaults

process.setMaxListeners(0)

// init http server
gulp.task('connect', async () => {
  await connect.server({
    root: 'www',
    port: 8080,
    livereload: true,
  })
})

// Config para el postCss
const plugins = [
  autoprefixer(),
  cssnano(), // minimiza los scss/css
]

// css de terceros
gulp.task('css', () => {
  return gulp
    .src(['dev/css/**/*.*'])
    .pipe(postcss(plugins))
    .pipe(gulp.dest('www/css'))
    .pipe(livereload())
    .on('end', () => {
      log('css Done!')
    })
})

gulp.task('sass', async () => {
  for (const page in projectSettings.pages) {
    await gulp
      .src(`dev/sass/pages/${page}.scss`)
      .pipe(concat(`/${page}.scss`)) // los mete todos en el mismo archivo
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(plugins))
      .pipe(
        rename({
          suffix: '.min',
        })
      ) // renombra
      .pipe(gulp.dest('www/css'))
      .pipe(livereload())
      .on('success', () => {
        log(`sass page: ${page} Done!`)
      })
  }
})

// Concatenate & Minify JS
gulp.task('scripts', () => {
  return gulp
    .src(['node_modules/babel-polyfill/dist/polyfill.js', 'src/js/*.js'])
    .pipe(prettier())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('www/js'))
    .pipe(livereload())
    .on('end', () => {
      log('scripts Done!')
    })
})

// copy statics && external css
gulp.task('statics', () => {
  const media = gulp
    .src('dev/media/**/*.*')
    .pipe(gulp.dest('www/media'))
    .pipe(livereload())

  return merge(media)
})

// compile pug to html and translate
gulp.task('pug', async () => {
  let translations = []
  for (const lang in projectSettings.langs) {
    for (const page in projectSettings.pages) {
      translations.push(
        await gulp
          .src('dev/pug/pages/' + projectSettings.pages[page] + '.pug')
          .pipe(
            pug({
              locals: {
                i18n: require('./dev/i18n/' +
                  projectSettings.langs[lang] +
                  '/translation.json'),
                lang: lang,
              },
            })
          )
          .pipe(
            rename({
              basename: projectSettings.pages[page],
            })
          )
          .pipe(
            critical({
              inline: true,
              base: 'www/',
              css: [`css/${projectSettings.pages[page]}.min.css`],
              minify: true,
              dimensions: [
                {
                  height: 200,
                  width: 500,
                },
                {
                  height: 900,
                  width: 1200,
                },
              ],
            })
          )
          .on('error', (error) => log(error))
          .pipe(gulp.dest(`www/${lang}`))
          .pipe(livereload())
      )
    }
  }
})

// Open one file with default application
/* gulp.task('open', async () => {
  await gulp.src('www/es/index.html')
    .pipe(open({ uri: 'http://localhost:8080/es/index.html' }))
}); */

// Concatenate & Minify JS
gulp.task('vendor', () => {
  return (
    gulp
      .src(['dev/js/vendor/**/*.*'])
      // .pipe(concat('app.min.js'))
      // .pipe(uglify())
      .pipe(babel())
      .pipe(concat('vendors.js'))
      .pipe(gulp.dest('www/js/vendor'))
      .pipe(livereload())
  )
})

// Json
gulp.task('json', () => {
  for (const lang in projectSettings.langs) {
    return gulp
      .src(['dev/i18n/' + projectSettings.langs[lang] + '/errormessage.json'])
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
    await gulp.watch(
      `dev/i18n/${projectSettings.langs[lang]}/*.json`,
      gulp.series(['json'])
    )
  }
})

// generate a build dist
gulp.task('zip', () => {
  return gulp
    .src('www/**/*.*')
    .pipe(zip('zip-landing.zip'))
    .pipe(gulp.dest('dist'))
})

gulp.task('styles', gulp.series(['sass', 'css']))
gulp.task(
  'scripts-statics',
  gulp.parallel(['statics', 'scripts', 'vendor', 'json'])
)
gulp.task('server', gulp.series(['connect', 'watch']))
gulp.task('build', gulp.series(['styles', 'scripts-statics', 'pug']))

// Default Task
gulp.task('default', gulp.parallel(['build', 'server']))
gulp.task('dist', gulp.series(['zip']))
