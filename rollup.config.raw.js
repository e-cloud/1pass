import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-html'
import replace from 'rollup-plugin-replace'

const version = require('./package.json').version

const dotAttrWrapOpen = /\{\{[~?=][^}]+\}\}/;
const dotAttrWrapClose = /\{\{\/[^}]+\}\}/;
const dotAttrWrapPair = [dotAttrWrapOpen, dotAttrWrapClose];

export function generate() {
  return {
    input: 'src/bookmarklet.js',
    output: {
      format: 'iife',
      file: 'demo/bundle.js'
    },
    plugins: [
      replace({
        PKG_VERSION: JSON.stringify(version)
      }),
      nodeResolve(),
      commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: ['node_modules/**'], // Default: undefined
        sourceMap: false,
      }),
      html({
        include: ['src/**/*.html', 'src/**/*.dot'],
        htmlMinifierOptions: {
          collapseWhitespace: process.env.NODE_ENV === 'Production',
          minifyCSS: process.env.NODE_ENV === 'Production',
          customAttrSurround: [dotAttrWrapPair],
        },
      }),
      babel({
        babelrc: false,
        plugins: ['transform-exponentiation-operator', 'transform-object-rest-spread', 'external-helpers'],
        presets: [['env', { modules: false }]],
        exclude: 'node_modules/**' // only transpile our source code
      }),
      process.env.NODE_ENV === 'Production' && uglify({
        output: {
          quote_style: 1,
        },
      }),
    ]
  }
}
