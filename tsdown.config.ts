import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  target: ['es2020'],
  outExtensions: ({format}) => {
    switch (format) {
      case 'es':  return { js: '.js', dts: '.ts' };
      case 'cjs': return { js: '.cjs', dts: '.' };
    }
    throw new Error('Unknown format');
  },
  clean: true,
  minify: true,
  dts: true,
  platform: 'neutral',
})