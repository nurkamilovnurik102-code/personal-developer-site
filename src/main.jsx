import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './app/router'
import { SiteContentProvider } from './context/SiteContentContext'
import './i18n'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteContentProvider>
      <RouterProvider router={router} />
    </SiteContentProvider>
  </React.StrictMode>,
)
