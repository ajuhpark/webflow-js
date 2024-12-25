// 3.vite.config.js
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({

  build: {
    server: {
      host: 'localhost',
      cors: '*',
      hmr: {
        host: 'localhost',
        protocol: 'ws',
      },
    },
    // this building a library is from this website: https://andrewwalpole.com/blog/use-vite-for-javascript-libraries/
    /*
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'webflow_js_library',
      fileName: (format) => `webflow_js_library.${format}.js`
    },
    */
    // I put this back from the original webflow + vite.js file.
    rollupOptions: {
      input: 'lib/color_mode_toggle.js',
      output: {
        format: 'umd',
        entryFileNames: 'color_mode_toggle.js',
        esModule: false,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  }
});
