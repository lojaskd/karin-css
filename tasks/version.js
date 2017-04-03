'use strict'

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * Given a version number MAJOR.MINOR.PATCH
 * You can use the commands
 *
 *     gulp version --v patch       # makes v0.1.0 → v0.1.1
 *     gulp version --v minor       # makes v0.1.1 → v0.2.0
 *     gulp version --v major       # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

import gulp from 'gulp'
import plugins from 'gulp-load-plugins'

const $ = plugins()
const basePath = `${__dirname}/../`
const v = $.util.env.v || 'patch'

function _version (importance) {
  // get all the files to bump version in
  return gulp.src([`${basePath}package.json`, `${basePath}bower.json`])
    .pipe($.bump({ type: importance })) // bump the version number in those files
    .pipe(gulp.dest(`${basePath}`)) // save it back to filesystem
    .pipe($.git.commit('Alterando versão e criando uma tag')) // commit the changed version number
    .pipe($.filter(`${basePath}package.json`)) // read only one file to get the version number
    .pipe($.tagVersion()) // **tag it in the repository**
}

gulp.task('version', () => _version(v))
