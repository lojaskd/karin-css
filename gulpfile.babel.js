'use strict';

import Gulp from 'gulp';
import Plugins from 'gulp-load-plugins';

import icons from './tasks/icons';
import stylesheets from './tasks/stylesheets';
import version from './tasks/version';

Gulp.task('watch', ['stylesheets', 'icons'], () => {
  Gulp.watch(`./sass/**/*.sass`, ['stylesheets']);
});

Gulp.task('default', [ 'watch' ]);
