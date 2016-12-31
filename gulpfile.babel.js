'use strict';

import Gulp from 'gulp';
import Plugins from 'gulp-load-plugins';
import Bourbon from 'node-bourbon';
import BrowserSync from 'browser-sync';

const $ = Plugins();
const BSync = BrowserSync.create();

Gulp.task('stylesheets', () => Gulp.src([ `src/**/*.sass` ])
  .pipe($.plumber({
    errorHandler: $.notify.onError({
      title   : 'Gulp',
      message : 'Error: <%= error.message %>'
    })
  }))
  .pipe($.sass({
    compass: true,
    sourcemap: false,
    noCache: true,
    style: 'expanded',
    sourceComments: 'normal',
    includePaths: [
      Bourbon.includePaths,
      `node_modules`,
      `src/bower`,
      `src/stylesheets`
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
  .pipe(Gulp.dest(`dist/stylesheets`))
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.cssnano())
  .pipe($.size({ title: 'Stylesheets minified!', gzip: false, showFiles: true }))
  .pipe(Gulp.dest(`dist/stylesheets`))
  .pipe(BSync.stream())
  .pipe($.plumber.stop()));

Gulp.task('serve', ['stylesheets'], () => {
  BSync.init({
    server: './dist'
  });
  Gulp.watch(`./src/**/*.sass`, ['stylesheets']);
  Gulp.watch(`./dist/**/*`).on('change', BSync.reload);
});

Gulp.task('watch', [ 'serve' ]);
Gulp.task('default', [ 'serve' ]);
