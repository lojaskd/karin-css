/* eslint no-unused-vars:0 */
'use strict'

import gulp from 'gulp'
import stylesheets from './tasks/stylesheets'
import version from './tasks/version'

gulp.task('watch', ['stylesheets'], () => {
  gulp.watch(`./sass/**/*.sass`, ['stylesheets'])
})

gulp.task('default', [ 'watch' ])
