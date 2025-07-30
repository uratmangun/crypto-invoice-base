import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PrivyAppProvider from './providers/PrivyProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyAppProvider>
      <App />
    </PrivyAppProvider>
  </StrictMode>,
)
