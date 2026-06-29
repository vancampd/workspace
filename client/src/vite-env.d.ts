/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXPRESS_API_URL?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
  readonly VITE_GOOGLE_GEOCODING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
