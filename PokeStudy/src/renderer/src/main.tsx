import '@fontsource/fredoka/400.css'
import '@fontsource/fredoka/600.css'
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { seedMock } from './mockseed'

if (import.meta.env.RENDERER_VITE_MOCK === 'evo') seedMock()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
