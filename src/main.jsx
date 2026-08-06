import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
import useStore from './store/useStore'

function mount() {
  const container = document.getElementById('root')
  if (!container) {
    requestAnimationFrame(mount)
    return
  }
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

async function start() {
  try {
    await useStore.getState().boot()
  } catch {
    /* demo rejimida davom etamiz */
  }
  mount()
}

start()