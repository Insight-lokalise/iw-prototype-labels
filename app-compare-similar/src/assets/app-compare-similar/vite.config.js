import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]s?$/,
    exclude: [],
  },
  define: {
    process: { env: {} },
  },
  resolve: {
    alias: {
      '~@insight/toolkit-css-core':
        './node_modules/@insight/toolkit-css-core/src/_all.scss',
      '~react-datepicker/dist/react-datepicker.css':
        './node_modules/react-datepicker/dist/react-datepicker.min.css',
      '~sass-mq/mq': './node_modules/sass-mq/_mq.scss',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // example : additionalData: `@import "./src/design/styles/variables";`
        // dont need include file extend .scss
        // additionalData: `@use "/node_modules/sass-mq/_mq.scss" as "~sass-mq/mq";`,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  plugins: [react()],
})
