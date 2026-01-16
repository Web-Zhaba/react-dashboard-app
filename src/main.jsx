import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Dashboard from './components/Layout/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Dashboard />
  // </StrictMode>,
)
