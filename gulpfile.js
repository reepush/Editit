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
    fs         = require('fs'),
    gutil      = require('gulp-util'),
    bump       = require('gulp-bump'),
    git        = require('gift'),
    exec       = require('child_process').exec


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
		.pipe(sass({ indentedSyntax: true, errLogToConsole: true }))
    .pipe(prefixer())
		.pipe(gulp.dest('client/public/styles'))
		.pipe(bs.reload({ stream: true }))
})

gulp.task('scripts', function() {
  var watchy = (function decorate(watchify) {
    // do not watch for build
    var task = process.argv[2] 
    if (task == 'build' || task == 'bump' || task == 'publish')
      return function(browserify) { return browserify }
    else
      return watchify
  })(watchify)

  var bundler = watchy(browserify(watchify.args))
                  .add('./client/scripts/main.js')

  bundler.on('update', function() {
    bundle()
  })

  bundler.on('time', function(time) {
    gutil.log('Finished', '\'' + gutil.colors.cyan('scripts') + '\'',
      'after', gutil.colors.magenta(time + ' ms'))
  })

  // bundle first time
  bundle()

  function bundle() {
    return plumber()
    .pipe(bundler.bundle())
    .pipe(source('main.js'))
    .pipe(gulp.dest('client/public/scripts'))
    .pipe(bs.reload({ stream: true }))
  }
})

gulp.task('templates', function() {
	return gulp.src('client/templates/*.jade')
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
		.pipe(gulp.dest('client/public'))
		.pipe(bs.reload({ stream: true }))
})

gulp.task('init', ['scssify'])

gulp.task('default', ['templates', 'scripts', 'styles'], function() {
	gulp.watch('client/templates/**', ['templates'])
	gulp.watch('client/styles/**', ['styles'])

  nodemon({
    script: 'server.js',
    watch: ['server.js', 'lib/*'],
    args: ['', '', '--dir', path.join(process.cwd(), 'test')]
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

gulp.task('build', ['templates', 'scripts', 'styles'])

gulp.task('bump', function() {
  return gulp.src('package.json')
    .pipe(bump())
    .pipe(gulp.dest('./'))
})

gulp.task('publish', ['build', 'bump'], function() {
  var version = require('./package.json').version

  var repo = git(process.cwd())
  repo.add('.', function() {
    repo.commit(version + ' version', function() {})
    exec('npm publish', function() {
      console.log(version + ' version was published!')
    })
  })

})

