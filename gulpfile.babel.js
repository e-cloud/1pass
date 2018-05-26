'use strict';

import del from 'del'
import fs from 'fs'
import gulp from 'gulp'
import through from 'through2'
import replaceStream from 'replacestream'
import rename from 'gulp-rename'
import { rollup } from 'rollup'
import _ from 'lodash'
import { create } from 'browser-sync'
import runSequence from 'run-sequence'
import * as workboxBuild from 'workbox-build'
import { version } from './package.json'
import { generate } from './rollup.config.raw'
import { template } from './src/lib/doT'

const state = {
  version,
  passLenRange: new Array(123).fill(0).map((v, k) => k + 6),
  passLen: 16,
  iteration: 100,
  salt: '9rjixtK35p091K2glFZWDgueRFqmSNfX'
}

const browserSync = create()

function dotPlugin(model) {
  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      // nothing to do
      return cb(null, file)
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streams not supported!'))
    } else if (file.isBuffer()) {
      const content = template(file.contents.toString(encoding))(model)
      // console.log(content)
      file.contents = new Buffer(content)
      cb(null, file)
    }
  })
}

function replaceScript() {
  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      // nothing to do
      return cb(null, file)
    }

    if (file.isStream()) {
      this.emit('error', new Error('Streams not supported!'))
      cb(null, file)
    } else if (file.isBuffer()) {
      const template$ = fs.createReadStream('./src/mobile/mobile.html')
        .pipe(replaceStream('$_SCRIPT_$', file.contents.toString(encoding)))

      file.contents = template$
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
    input: './src/install/install.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      file: 'dist/install.js'
    })
  })
})

gulp.task('install', [], function (callback) {
  runSequence('build-install-tpl', 'build-install-js', callback)
})

gulp.task('mobile', function () {
  const cloneConfig = _.merge({}, generate(), {
    input: './src/mobile/mobile.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      file: 'dist/mobile.js'
    })
  })
})

gulp.task('mobile:pwa:index', function () {
  return gulp.src('./src/pwa/index.html')
    .pipe(rename({
      basename: 'pwa'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('mobile:pwa:deps', function () {
  return gulp.src('./node_modules/workbox-sw/build/workbox-sw.js')
    .pipe(gulp.dest('./dist/libs/workbox-sw/build'))
})

gulp.task('mobile:pwa', ['mobile:pwa:index', 'mobile:pwa:deps'], function () {
  const cloneConfig = _.merge({}, generate(), {
    input: './src/pwa/app.js'
  })
  return rollup(cloneConfig).then(function (bundle) {
    return bundle.write({
      format: 'iife',
      file: 'dist/app.js'
    })
  })
})

gulp.task('build-service-worker', function () {
  return workboxBuild.injectManifest({
    swSrc: 'src/pwa/sw.js',
    swDest: 'dist/sw.js',
    globDirectory: 'dist/',
    globPatterns: [
      '**/*.png',
      '**/*.ico',
      'app.js',
      'pwa.html',
      '*.json'
    ]
  })
})

gulp.task('assets', function () {
  return gulp.src(['./src/assets/**', '!*.ai'])
    .pipe(gulp.dest('./dist/'))
})

gulp.task('mobile:all', ['mobile', 'mobile:pwa'], function () {
  // inject the script into mobile.html and output seperatly
  return gulp.src(['./dist/mobile.js'])
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

gulp.task('bundle', [], function () {
  process.env.NODE_ENV = 'Production'
  return rollup(generate()).then(function (bundle) {
    process.env.NODE_ENV = 'Development'
    return bundle.write({
      format: 'iife',
      file: './dist/bundle.js'
    })
  })
})

gulp.task('build', [], function (cb) {
  runSequence('clean', ['install', 'mobile:all', 'assets'], 'build-service-worker', 'bundle', cb)
})

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('watch', ['build'], function (done) {
  browserSync.reload()
  done()
})

gulp.task('clean', function () {
  return del('./dist')
})

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build'], function () {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch('src/**', ['watch'])
})

gulp.task('default', function (cb) {
  runSequence('env', ['build'], cb)
})
