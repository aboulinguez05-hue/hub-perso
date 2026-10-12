import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CompteProvider } from './compte.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Rend le compte Google connecté accessible à toutes les pages */}
    <CompteProvider>
      <App />
    </CompteProvider>
  </StrictMode>,
)
