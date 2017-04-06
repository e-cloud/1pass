'use strict';

import { template } from './src/lib/doT'
import gulp from 'gulp'
import through from 'through2'
import rename from 'gulp-rename'
import {rollup} from 'rollup'
import {generate} from './rollup.config'
import _ from 'lodash'
import { version } from './package.json'

const state = {
  version: version,
  passLenRange: new Array(123).fill(0).map((v, k) => k + 6),
  passLen: 16,
  iteration: 100,
  salt: '9rjixtK35p091K2glFZWDgueRFqmSNfX'
};

function dotPlugin(state) {
  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streams not supported!'));
    } else if (file.isBuffer()) {
      const content = template(file.contents.toString(encoding))(state)
      //console.log(content)
      file.contents = new Buffer(content)
      cb(null, file)
    }
  })
}

gulp.task('build-install-tpl', function () {
  return gulp.src('./src/install/install.html')
    .pipe(dotPlugin(state))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('install', ['env', 'build-install-tpl'], function () {
  const cloneConfig = _.merge({}, generate(), {
    entry: './src/install/install.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: 'dist/install.js'
    });
  });
})

gulp.task('env', function (cb) {
  process.env.NODE_ENV = 'Production'
  cb()
})

gulp.task('build', ['install'], function () {
  return rollup(generate()).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: './dist/bundle.js'
    });
  });
})

gulp.task('default', ['build'])
