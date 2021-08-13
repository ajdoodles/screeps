import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'main.js',
  output: {
    file: 'main.min.js',
    format: 'cjs',
    sourcemap: 'inline'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};
