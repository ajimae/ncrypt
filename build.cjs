const path = require('path');
const { existsSync, rmSync } = require('fs');
const { dependencies } = require('./package.json');

const root = process.cwd();
const distDir = root + '/dist';


if (existsSync(distDir))
rmSync(distDir, { recursive: true });

// bundle source
await Bun.build({
  target: 'bun',
  outdir: './dist',
  format: 'esm', // there is currently no cjs
  // minify: true,
  entrypoints: ['./index.ts'],
  external: Object.keys(dependencies)
});

// generate declaration (index.d.ts) file
new (require('npm-dts').Generator)({
  root: path.resolve(process.cwd()),
  entry: path.resolve(process.cwd(), 'index.ts'),
  output: path.resolve(process.cwd(), 'dist', 'index.d.ts'),
  tmp: path.resolve(process.cwd(), 'cache/tmp'),
  tsc: '--extendedDiagnostics'
}).generate();
