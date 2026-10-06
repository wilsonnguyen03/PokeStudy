import '@fontsource/fredoka/400.css'
import '@fontsource/fredoka/600.css'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { seedDemo, seedMock } from './mockseed'

if (import.meta.env.RENDERER_VITE_MOCK === 'evo') seedMock()

// Web demo build: frame the app and start first-time visitors with a filled-in save
if (import.meta.env.RENDERER_VITE_WEB === '1') {
  document.documentElement.classList.add('web')
  seedDemo()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
