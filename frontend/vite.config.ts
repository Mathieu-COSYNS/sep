import path from 'path';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';

import config from './app.config.json';
import transformManifest from './transform-manifest';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  process.env.VITE_APP_NAME = env.VITE_APP_NAME || config.appName;
  process.env.VITE_APP_SHORT_NAME = env.VITE_APP_SHORT_NAME || config.appShortName;
  process.env.VITE_APP_DESCRIPTION = env.VITE_APP_DESCRIPTION || config.appDescription;
  process.env.VITE_APP_LOGO = env.VITE_APP_LOGO || config.logo;
  process.env.VITE_APP_LOGO_BACKGROUND_COLOR = env.VITE_APP_LOGO_BACKGROUND_COLOR || config.logoBackgroundColor;
  process.env.VITE_APP_QR_CODE_URL = env.VITE_APP_QR_CODE_URL || config.qrCodeUrl;

  return {
    plugins: [
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: process.env.VITE_APP_NAME,
            injectInHead:
              process.env.NODE_ENV != 'production'
                ? `<link rel="icon" href="${process.env.VITE_APP_LOGO.replace(/^\.\/public/, '')}" />`
                : null,
          },
        },
      }),
      ...faviconsInProd(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        manifest: false,
        injectRegister: null,
      }),
      react(),
      legacy(),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
      mainFields: ['module'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});

const faviconsInProd = () => {
  if (process.env.NODE_ENV != 'production') return [];
  return [
    vitePluginFaviconsInject(process.env.VITE_APP_LOGO, {
      appName: process.env.VITE_APP_NAME,
      appShortName: process.env.VITE_APP_SHORT_NAME,
      appDescription: process.env.VITE_APP_DESCRIPTION,
      lang: 'fr',
      background: process.env.VITE_APP_LOGO_BACKGROUND_COLOR,
      theme_color: '#3880ff',
      appleStatusBarStyle: 'black',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      version: process.env.VITE_APP_VERSION,
      logging: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        windows: true,
        yandex: true,
      },
      // files: {
      //   android: {
      //     manifestFileName: 'manifest.json',
      //   },
      // },
    }),
    transformManifest({
      extraContent: {
        screenshots: config.screenshots,
        url_handlers: [
          {
            origin: process.env.VITE_APP_QR_CODE_URL,
          },
        ],
      },
    }),
  ];
};
