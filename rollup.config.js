import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.min.js',
    format: 'cjs',
    sourcemap: 'inline'
  },
  plugins: [
    resolve({ rootDir: 'src'}),
    commonjs()
  ]
};
