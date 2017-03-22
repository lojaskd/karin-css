'use strict'

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

import Gulp from 'gulp'
import Plugins from 'gulp-load-plugins'

const $ = Plugins()

function version (importance) {
  // get all the files to bump version in
  return Gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe($.bump({ type: importance }))
    // save it back to filesystem
    .pipe(Gulp.dest('./'))
    // commit the changed version number
    .pipe($.git.commit('bumps package version'))
    // read only one file to get the version number
    .pipe($.filter('package.json'))
    // **tag it in the repository**
    .pipe($.tagVersion())
}

// gulp version:patch      -> makes v0.1.0 → v0.1.1
Gulp.task('version:patch', () => version('patch'))

// gulp version:feature    -> makes v0.1.1 → v0.2.0
Gulp.task('version:feature', () => version('minor'))

// gulp version:release    -> makes v0.2.1 → v1.0.0
Gulp.task('version:release', () => version('major'))
