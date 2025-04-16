/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_BASE_URL: string;
  // Agrega aquí otras variables de entorno que uses en tu aplicación
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
