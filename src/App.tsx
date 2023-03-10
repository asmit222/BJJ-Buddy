import React, { useState, lazy } from 'react'
import NavBar from './components/NavBar'

import Library from './views/Library'
import Home from './views/Home'
import Account from './views/Account'
import { Route, Switch } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const LazyCss = lazy(() => import('./components/LazyCss'))

const App: React.FC = () => {
  const { user } = useAuth0()
  const [clickedHomeIcon, setClickedHomeIcon] = useState(false)

  return (
    <React.Fragment>
      <NavBar setClickedHomeIcon={setClickedHomeIcon} />
      <div id='appContainer'>
        <Switch>
          <Route path='/Library' component={() => <Library user={user} />} />
          <Route path='/Account' component={() => <Account user={user} />} />
          <Route
            path='/'
            component={() => <Home clickedHomeIcon={clickedHomeIcon} />}
          />
        </Switch>
      </div>
      <React.Suspense fallback={null}>
        <LazyCss />
      </React.Suspense>
    </React.Fragment>
  )
}

export default App
