import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * Lokální vývoj: `/api` → Fastify (stejný origin jako dev server, bez CORS).
 * Výchozí cíl `:3000`; přepsání např. `VITE_CMS_PROXY_TARGET=http://127.0.0.1:4000`.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget =
    env.VITE_CMS_PROXY_TARGET?.trim() || 'http://localhost:3000'

  if (mode === 'production') {
    const hasCmsKey = Boolean(
      env.VITE_CMS_API_KEY_BLOCLAB?.trim() ||
        env.VITE_CMS_API_KEY_REDUS?.trim() ||
        env.VITE_CMS_API_KEY?.trim() ||
        env.PUBLIC_CMS_API_KEY?.trim()
    )
    if (!hasCmsKey) {
      console.warn(
        '[CMS] Produkční build: není nastaven žádný z VITE_CMS_API_KEY_BLOCLAB, VITE_CMS_API_KEY_REDUS ani VITE_CMS_API_KEY — API nebude fungovat.'
      )
    }
  }

  return {
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
