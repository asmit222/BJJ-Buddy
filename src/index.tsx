import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

ReactDOM.render(
  <Auth0Provider
    domain={'dev-uahsycbf.us.auth0.com'}
    clientId={'iyRL3NxgMTqdKndT8tb0fPHcil7b1Ipb'}
    redirectUri={window.location.origin}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('app')
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register({
      onUpdate: (e) => {
        const { waiting: { postMessage = null } = {} as any, update } = e || {}
        if (postMessage) {
          postMessage({ type: 'SKIP_WAITING' })
        }
        update().then(() => {
          window.location.reload()
        })
      }
    })
  })
}
