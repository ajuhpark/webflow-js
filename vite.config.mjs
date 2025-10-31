import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: 'localhost',
    cors: true, // Use true instead of '*'. Adjust if specific CORS rules are needed.
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        homepage: 'lib/homepage.js',
        color_mode: 'lib/color_mode_toggle.js',
        case_study: 'lib/case_study.js',
        cs_website_builder_tools: 'lib/cs_website_builder_tools.js',
      },
      output: {
        dir: 'dist', // Ensure the output directory is specified
        format: 'es', // Use 'es' format for code-splitting
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