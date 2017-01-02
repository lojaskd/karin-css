'use strict';

import Gulp from 'gulp';
import Plugins from 'gulp-load-plugins';
import Bourbon from 'node-bourbon';

const $ = Plugins();

const plumberHandler = {
  errorHandler: $.notify.onError({
    title   : 'Gulp',
    message : 'Error: <%= error.message %>'
  })
};

Gulp.task('stylesheets', () => Gulp.src([ `sass/**/*.sass` ])
  .pipe($.plumber(plumberHandler))
  .pipe($.sass({
    compass: true,
    sourcemap: false,
    noCache: true,
    style: 'expanded',
    sourceComments: 'normal',
    includePaths: [
      Bourbon.includePaths,
      `sass`,
      `node_modules`,
      `bower`
    ]
  }))
  .pipe($.autoprefixer({
    browsers: [
      'ie >= 9',
      'ie_mob >= 10',
      'ff >= 30',
      'chrome >= 34',
      'safari >= 5',
      'opera >= 23',
      'ios >= 6',
      'android >= 4.4',
      'bb >= 10'
    ],
    cascade: false
  }))
  .pipe($.combineMq())
  .pipe($.jsbeautifier({
    indent_size: 2,
    indent_char: ' ',
  }))
  .pipe($.size({ title: 'Stylesheets!', gzip: false, showFiles: true }))
  .pipe(Gulp.dest(`dist`))
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.cssnano())
  .pipe($.size({ title: 'Stylesheets minified!', gzip: false, showFiles: true }))
  .pipe(Gulp.dest(`dist`))
  .pipe($.plumber.stop()));

Gulp.task('watch', ['stylesheets'], () => {
  Gulp.watch(`./sass/**/*.sass`, ['stylesheets']);
});

Gulp.task('default', [ 'watch' ]);
