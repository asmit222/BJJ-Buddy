import * as React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const NavBar: React.FC = (props) => {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0()

  return (
    <nav className='navbar navbar-dark bg-dark'>
      <Link style={{ textDecoration: 'none' }} to='/'>
        <div
          onClick={() => {
            props.setClickedHomeIcon(true)
          }}
          className='navBarIconAndTextDiv'
        >
          <span className='navbar-brand home-title-navbar'>
            <span className='navbarInnerText'>Home</span>
            <i className='fas fa-home fa-lg'></i>
          </span>
        </div>
      </Link>
      <Link style={{ textDecoration: 'none' }} to='/Library'>
        <div className='navBarIconAndTextDiv'>
          <span className='navbar-brand home-title-navbar'>
            <span className='navbarInnerText'>Library</span>
            <i className='fas fa-book fa-lg'></i>
          </span>
        </div>
      </Link>
      <div className='navBarIconAndTextDiv'>
        <span className='navbar-brand home-title-navbar'>
          {isAuthenticated ? (
            <span className='navbarInnerText'>Logout</span>
          ) : (
            <span className='navbarInnerText'>Login</span>
          )}
          {isAuthenticated ? (
            <i onClick={() => logout()} className='fas fa-sign-out fa-lg'></i>
          ) : (
            <i
              onClick={() => loginWithRedirect()}
              className='fas fa-sign-in fa-lg'
            ></i>
          )}
        </span>
      </div>
    </nav>
  )
}

export default NavBar
