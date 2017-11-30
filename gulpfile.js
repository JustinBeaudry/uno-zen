'use strict'

var gulp = require('gulp');
var plugins = require('gulp-load-plugin')();
var pkg = require('./package.json');
var _s = require('underscore.string');
var browserSync = require('browser-sync');

const PORT = {
  GHOST: 2387,
  BROWSERSYNC: 3000
};

var dist = {
  name: _s.slugify(pkg.name),
  css: 'assets/css',
  js: 'assets/js'
};

var src = {
  sass: {
    main: 'assets/scss/' + dist.name + '.scss',
    files: ['assets/scss/**/**']
  },
  js: {
    vendor: [
      'assets/vendor/fastclick/lib/fastclick.js',
      'assets/vendor/ghostHunter/jquery.ghostHunter.min.js',
      'assets/vendor/pace/pace.min.js',
      'assets/vendor/fitvids/jquery.fitvids.js',
      'assets/vendor/reading-time/build/reading-time.min.js'
    ]
  },
  css: {
    main: 'assets/css/' + dist.name + '.css'
  }
};

var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version <%= pkg.version %>',
  ' * @link    <%= pkg.homepage %>',
  ' * @author  <%= pkg.author.name %> (<%= pkg.author.url %>)',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

gulp.task('css', function() {
  return gulp.src(src.css.vendor)
    .pipe(plugins.changed(dist.css))
    .pipe(plugins.addsrc(src.sass.main))
    .pipe(plugins.sass().on('error', plugins.util.log))
    .pipe(plugins.concat('' + dist.name + '.css'))
    .pipe(plugins.prefix())
    .pipe(plugins.strip({all: true}))
    .pipe(plugins.cssmin())
    .pipe(plugins.header(banner, {pkg: pkg}))
    .pipe(gulp.dest(dist.css));
});

gulp.task('js', function() {
  return gulp.src(src.js.vendor)
    .pipe(plugins.concat('' + dist.name + '.js'))
    .pipe(plugins.uglify({mangle: false}))
    .pipe(plugins.header(banner, {pkg: pkg}))
    .pipe(gulp.dest(dist.js));
});

gulp.task('server', function() {
  return browserSync.init(null, {
    proxy: "http://127.0.0.1:#{PORT.GHOST}",
    files: ['assets/**/*.*'],
    reloadDelay: 300,
    port: PORT.BROWSERSYNC
  })
});

gulp.task('build', ['css', 'js'])

gulp.task('default', function() {
  gulp.start(['build', 'server']);
  gulp.watch(src.sass.files, ['css']);
  gulp.watch(src.js.main, ['js']);
  gulp.watch(src.js.vendor, ['js']);
});
