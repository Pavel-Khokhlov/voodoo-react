import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/nyt': {
        target: 'https://api.nytimes.com/svc',
        changeOrigin: true,
        rewrite: (path) => {
          console.log('Original path:', path);
          const newPath = path.replace(/^\/api\/nyt/, '');
          console.log('Rewritten path:', newPath);
          return newPath;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying to:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
            proxyReq.setHeader('Origin', 'https://api.nytimes.com');
          });
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Response status:', proxyRes.statusCode);
          });
        }
      }
    }
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Автоматически импортируем переменные во все SCSS файлы
        // Используем алиас @ для правильного пути из любой папки
        additionalData: `@use "@/styles/variables" as *;`
      }
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
});
