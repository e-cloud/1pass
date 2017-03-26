import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';

const dotAttrWrapOpen = /\{\{[~?=][^}]+\}\}/;
const dotAttrWrapClose = /\{\{\/[^}]+\}\}/;
const dotAttrWrapPair = [dotAttrWrapOpen, dotAttrWrapClose];

export default {
  entry: 'src/main.js',
  format: 'iife',
  dest: 'demo/bundle.js',
  plugins: [
    nodeResolve(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**', // Default: undefined
      sourceMap: false,
      namedExports: {
        'dot/doT': ['template']
      }
    }),
    html({
      include: 'src/**/*.html',
      htmlMinifierOptions: {
        collapseWhitespace: process.env.NODE_ENV === "Production",
        customAttrSurround: [dotAttrWrapPair]
      }
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    process.env.NODE_ENV === "Production" && uglify({
      output: {
        quote_style: 1
      }
    })
  ]
};
