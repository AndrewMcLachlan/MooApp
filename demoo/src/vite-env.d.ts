/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BS: string
  readonly VITE_REACT_APP_VERSION: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}