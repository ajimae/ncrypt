// rollup.config.js
// import typescript from '@rollup/plugin-typescript';
// Saved working directory and index state WIP on master: e1a9b91 feat(randomStr): add random string generated
import ts from 'rollup-plugin-ts'
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
  input: 'index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' }
  ],
  external: ['crypto'],
  plugins: [ts(), commonjs()]
};