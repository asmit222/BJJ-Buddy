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

// if (caches) {
//   // Service worker cache should be cleared with caches.delete()
//   caches.keys().then(function (names) {
//     for (let name of names) caches.delete(name)
//   })
// }
// // window.location.reload(true)
