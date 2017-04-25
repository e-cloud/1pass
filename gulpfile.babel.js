'use strict';

import { template } from './src/lib/doT'
import gulp from 'gulp'
import fs from 'fs'
import through from 'through2'
import replaceStream from 'replacestream'
import rename from 'gulp-rename'
import { rollup } from 'rollup'
import { generate } from './rollup.config.raw'
import _ from 'lodash'
import { version } from './package.json'
import { create } from 'browser-sync'
import del from 'del'
import runSequence from 'run-sequence'

const state = {
  version: version,
  passLenRange: new Array(123).fill(0).map((v, k) => k + 6),
  passLen: 16,
  iteration: 100,
  salt: '9rjixtK35p091K2glFZWDgueRFqmSNfX'
};

const browserSync = create()

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
      basename: 'index',
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('build-install-js', function () {
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

gulp.task('install', [], function (callback) {
  runSequence('clean', 'build-install-tpl', 'build-install-js', callback);
})

gulp.task('mobile', function () {
  const cloneConfig = _.merge({}, generate(), {
    entry: './src/mobile/mobile.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: 'dist/mobile.js'
    });
  });
})

gulp.task('mobile:offline', function () {
  const cloneConfig = _.merge({}, generate(), {
    entry: './src/mobile/mobile-offline.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      dest: 'dist/mobile-offline.js'
    });
  });
})

function replaceScript() {
  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streams not supported!'));
      cb(null, file)
    } else if (file.isBuffer()) {
      const template$ = fs.createReadStream('./src/mobile/mobile.html')
        .pipe(replaceStream('$_SCRIPT_$', file.contents.toString(encoding)))

      file.contents = template$
      cb(null, file)
    }
  })
}

gulp.task('mobile:all', ['mobile', 'mobile:offline'], function () {
  return gulp.src(['./dist/mobile.js', './dist/mobile-offline.js'])
    .pipe(replaceScript())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('env', function (cb) {
  process.env.NODE_ENV = 'Production'
  cb()
})

gulp.task('build', ['install', 'mobile:all'], function () {
  process.env.NODE_ENV = 'Production'
  return rollup(generate()).then(function (bundle) {
    process.env.NODE_ENV = 'Development'
    return bundle.write({
      format: 'iife',
      dest: './dist/bundle.js'
    });
  });
})

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['build'], function (done) {
  browserSync.reload();
  done();
})

gulp.task('clean', function () {
  return del('./dist');
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build'], function () {

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch('src/**', ['js-watch']);
})

gulp.task('default', function (cb) {
  runSequence('env', ['build'], cb)
})
