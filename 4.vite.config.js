// 4.vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({

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
        dir: 'dist/color_mode_toggle', // Output directory unique to this build
        format: 'es', // Use 'es' format for code-splitting
        entryFileNames: '[name].js',
        esModule: true,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
    assetsDir: 'static', // Change 'assets' to 'static' or any other directory name you prefer
  }
});
