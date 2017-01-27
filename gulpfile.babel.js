'use strict';

import Gulp from 'gulp';
import Plugins from 'gulp-load-plugins';
import Bourbon from 'node-bourbon';
import pkg from './package.json';

const $ = Plugins();

const plumberHandler = {
  errorHandler: $.notify.onError({
    title   : 'Gulp',
    message : 'Error: <%= error.message %>'
  })
};

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' * @copyright 2016 <%= pkg.author %>.',
  ' * @link https://github.com/lojaskd/karin',
  ' */',
  ''].join('\n');

Gulp.task('stylesheets', () => Gulp.src([ `sass/**/*.sass` ])
  .pipe($.plumber(plumberHandler))
  .pipe($.sass({
    compass: true,
    sourcemap: false,
    noCache: true,
    style: 'nested',
    sourceComments: false,
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
  .pipe($.size({ title: 'Stylesheets!', gzip: false, showFiles: true }))
  .pipe($.header(banner, { pkg }))
  .pipe(Gulp.dest(`dist`))
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.cssnano())
  .pipe($.size({ title: 'Stylesheets minified!', gzip: false, showFiles: true }))
  .pipe($.header(banner, { pkg }))
  .pipe(Gulp.dest(`dist`))
  .pipe($.plumber.stop()));

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function version(importance) {
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
    .pipe($.tagVersion());
}

Gulp.task('version:patch', () => version('patch'));
Gulp.task('version:feature', () => version('minor'));
Gulp.task('version:release', () => version('major'));

Gulp.task('watch', ['stylesheets'], () => {
  Gulp.watch(`./sass/**/*.sass`, ['stylesheets']);
});

Gulp.task('default', [ 'watch' ]);
