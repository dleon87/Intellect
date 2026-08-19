import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerLicense } from '@syncfusion/ej2-base'
import App from './App'
import './tokens.css'

const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY
if (licenseKey) {
  registerLicense(licenseKey)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
