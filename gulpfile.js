var gulp	     = require('gulp'),
    bs	       = require('browser-sync'),
    sass	     = require('gulp-sass'),
    jade       = require('gulp-jade'),
    plumber	   = require('gulp-plumber'),
    path       = require('path'),
    prefixer   = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    watchify   = require('watchify'),
    source     = require('vinyl-source-stream'),
    nodemon    = require('nodemon'),
    fs         = require('fs')

gulp.task('scssify', function() {
  var files = [
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'node_modules/codemirror/lib/codemirror.css',
    'node_modules/codemirror/theme/lesser-dark.css',
    'node_modules/highlight.js/styles/default.css'
  ]

  files.forEach(function(file) {
    var data = fs.readFileSync(file)
    var scssed = scssify(file)
    fs.writeFileSync(scssed, data)
  })

  function scssify(file) {
    var ext = path.extname(file)
    return file.replace(ext, '.scss')
  }
})

gulp.task('styles', function() {
	return gulp.src('client/styles/main.sass')
		.pipe(plumber())
		.pipe(sass({ indentedSyntax: true }))
    .pipe(prefixer())
		.pipe(gulp.dest('client/public/styles'))
		.pipe(bs.reload({ stream: true }))
})

gulp.task('scripts', function scripts() {
  scripts.bundler = scripts.bundler
    ? scripts.bundler
    : scripts.bundler = watchify(browserify('./client/scripts/main.js'))

  return scripts.bundler.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('client/public/scripts'))
    .pipe(bs.reload({ stream: true }))
})

gulp.task('templates', function() {
	return gulp.src('client/templates/*.jade')
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
		.pipe(gulp.dest('client/public'))
		.pipe(bs.reload({ stream: true }))
})

gulp.task('init', ['scssify'])

gulp.task('default', ['templates', 'scripts', 'styles', 'scripts'], function() {
	gulp.watch('client/templates/**', ['templates'])
	gulp.watch('client/scripts/**', ['scripts'])
	gulp.watch('client/styles/**', ['styles'])

  nodemon({
    script: 'server.js',
    watch: ['server.js', 'lib/*'],
  }).on('restart', function() {
      // server does not start up immediately
      setTimeout(function() {
        bs.reload()
      }, 1000)
  })

  bs({ proxy: 'localhost:3001',
       port: 3000,
       open: false,
       online: false,
       ui: false
  })
})

