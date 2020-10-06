import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import license from 'rollup-plugin-license';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: './dist',
      entryFileNames: 'index.common.js',
      format: 'cjs',
    },
    {
      name: 'virtualPrisms',
      dir: './dist',
      entryFileNames: 'index.umd.js',
      format: 'umd',
    },
    {
      dir: './dist',
      entryFileNames: 'index.esm.js',
      format: 'esm',
    }
  ],
  plugins: [
    excludeDependenciesFromBundle({
      dependencies: true,
      peerDependencies: true
    }),
    nodeResolve({
      extensions: ['.js'],
      preferBuiltins: false,
      browser: true
    }),
    typescript(
      {
        declaration: true,
        declarationDir: 'dist/types/',
      }
    ),
    commonjs({ extensions: ['.js'] }),
    json(),
    license({
      sourcemap: true,

      banner: {
        commentStyle: 'regular', // The default

        content: {
          file: 'LICENSE',
        }
      },

      thirdParty: {
        includePrivate: true, // Default is false.
        output: {
          file: 'dist/dependencies.txt'
        },
      },
    }),
  ],
};