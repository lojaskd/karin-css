'use strict';

import Gulp from 'gulp';
import Plugins from 'gulp-load-plugins';

const $ = Plugins();

const plumberHandler = {
  errorHandler: $.notify.onError({
    title   : 'Gulp',
    message : 'Error: <%= error.message %>'
  })
};

Gulp.task('icons:copy', () => Gulp.src([ `bower/material-design-icons/iconfont/MaterialIcons-Regular.*` ])
  .pipe($.plumber(plumberHandler))
  .pipe(Gulp.dest(`dist/fonts`))
  .pipe($.plumber.stop()));

Gulp.task('icons', [ 'icons:copy' ]);
