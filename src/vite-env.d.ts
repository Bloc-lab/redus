/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_CMS_API_URL?: string
  readonly VITE_API_URL?: string
  readonly VITE_CMS_API_URL?: string
  readonly PUBLIC_CMS_API_URL?: string
  readonly VITE_CMS_API_KEY?: string
  readonly VITE_CMS_API_KEY_BLOCLAB?: string
  readonly VITE_CMS_API_KEY_REDUS?: string
  readonly PUBLIC_CMS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
