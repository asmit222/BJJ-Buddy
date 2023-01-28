import React, { useEffect, useState, lazy } from 'react'
import NavBar from './components/NavBar'
import Library from './views/Library'
import Home from './views/Home'
import { Route, Switch } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useScratch } from 'react-use'
import CacheBuster from 'react-cache-buster'
import { version } from '../package.json'

const LazyCss = lazy(() => import('./components/LazyCss'))

const App: React.FC = () => {
  const { user } = useAuth0()
  const [clickedHomeIcon, setClickedHomeIcon] = useState(false)

  return (
    <React.Fragment>
      <CacheBuster
        currentVersion={version}
        isEnabled={true} //If false, the library is disabled.
        isVerboseMode={false} //If true, the library writes verbose logs to console.
        metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
      >
        <NavBar setClickedHomeIcon={setClickedHomeIcon} />
        <div id='appContainer'>
          <Switch>
            <Route
              path='/Library'
              render={(props) => <Library user={user} />}
            />
            <Route
              path='/'
              render={(props) => <Home clickedHomeIcon={clickedHomeIcon} />}
            />
          </Switch>
        </div>
      </CacheBuster>
    </React.Fragment>
  )
}

export default App
