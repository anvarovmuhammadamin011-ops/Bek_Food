import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
import useStore from './store/useStore'

async function start() {
  try {
    await useStore.getState().boot()
  } catch {
    /* demo rejimida davom etamiz */
  }
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()