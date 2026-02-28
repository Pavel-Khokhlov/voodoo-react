/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NYT_API_KEY: string
  readonly VITE_NYT_API_URL: string
  readonly VITE_NYT_ALL_BOOKS: string
  readonly VITE_NYT_SECTIONS: string
  readonly VITE_NYT_TOP_STORIES: string
  readonly VITE_APP_VERSION: string
  // добавьте другие переменные окружения
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}