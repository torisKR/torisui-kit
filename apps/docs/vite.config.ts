import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
// @ts-expect-error Node-only build plugin; executed by Vite, not the browser.
import { gallerySchemaPlugin } from '../../scripts/gallery-schema.mjs';

// The playground consumes the library from source (not dist) so component
// changes hot-reload without a rebuild.
export default defineConfig({
  base: '/torisui-kit/',
  plugins: [react(), gallerySchemaPlugin(fileURLToPath(new URL('../../', import.meta.url)))],
  resolve: {
    alias: [
      {
        find: '@toris-dev/ui',
        replacement: fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      },
    ],
  },
});
