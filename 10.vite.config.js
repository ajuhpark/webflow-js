// 1.vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    cors: '*',
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },

  build: {
    minify: true,
    cssCodeSplit: false,
    // this building a library is from this website: https://andrewwalpole.com/blog/use-vite-for-javascript-libraries/
    /*
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'webflow_js_library',
      fileName: (format) => `webflow_js_library.${format}.js`
    },
    */
    // I put this back from the original webflow + vite.js file.
    target: 'esnext', // Ensures modern JavaScript
    rollupOptions: {
      input: 'lib/ux_home_v2.js',
      output: {
        dir: 'dist/ux_home_v2', // Output directory unique to this build
        format: 'es',
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        esModule: true,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  }
});

/* 
// original vite.config.js code below
// vite.config.js
export default defineConfig({
  plugins: [eslintPlugin({ cache: false })],
  server: {
    host: 'localhost',
    cors: '*',
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
  build: {
    minify: true,
    manifest: true,
    rollupOptions: {
      input: './src/main.js',
      output: {
        format: 'umd',
        entryFileNames: 'main.js',
        esModule: false,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  },
})
*/

