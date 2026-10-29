import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

document.documentElement.lang = 'es'
document.body.innerHTML = '<div id="root"></div>'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)