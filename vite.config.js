import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

// Загружаем .env файл в самом начале
dotenv.config();
// Получаем API ключ из process.env
const API_KEY = process.env.VITE_NYT_API_KEY;
const API_URL = process.env.VITE_NYT_API_URL;

// Определяем base для GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPages ? '/voodoo-react/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api/nyt": {
        target: API_URL,
        changeOrigin: true,
        rewrite: (path) => {
          // Убираем /api/nyt из начала пути
          const newPath = path.replace(/^\/api\/nyt/, "");
          return newPath;
        },
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            // Добавляем api-key к URL, если его нет
            if (!proxyReq.path.includes('api-key=') && API_KEY) {
              const separator = proxyReq.path.includes('?') ? '&' : '?';
              proxyReq.path += `${separator}api-key=${API_KEY}`;
            }
            console.log("Final URL:", proxyReq.path);
          });
        },
      },
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Автоматически импортируем переменные во все SCSS файлы
        // Используем алиас @ для правильного пути из любой папки
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
});
