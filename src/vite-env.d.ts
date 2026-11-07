/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTFOLIO_CHAT_WEBHOOK_URL: string
  readonly VITE_PORTFOLIO_CHAT_CALLBACK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
