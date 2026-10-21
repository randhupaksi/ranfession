import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExperienceBoundary } from './components/ExperienceBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExperienceBoundary><App /></ExperienceBoundary>
  </StrictMode>,
)
