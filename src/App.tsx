import React, { useEffect, useState, lazy } from 'react'
import NavBar from './components/NavBar'
import Library from './views/Library'
import Home from './views/Home'
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
          <Route path='/Library' render={(props) => <Library user={user} />} />
          <Route
            path='/'
            render={(props) => <Home clickedHomeIcon={clickedHomeIcon} />}
          />
        </Switch>
      </div>
    </React.Fragment>
  )
}

export default App
