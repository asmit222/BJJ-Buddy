import * as React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const NavBar: React.FC = () => {
  const [collapse, setCollapse] = React.useState('collapse')
  const [navbarDropdownShow, setNavbarDropdownShow] = React.useState('')
  const [navbarDropdownShow2, setNavbarDropdownShow2] = React.useState('')

  const { logout, isAuthenticated } = useAuth0()

  const { loginWithRedirect } = useAuth0()

  return (
    <nav className='navbar navbar-dark bg-dark'>
      <Link to='/'>
        <span
          onClick={() => {
            setCollapse('collapse')
          }}
          className='navbar-brand home-title-navbar'
        >
          <i className='fas fa-home fa-lg'></i>
        </span>
      </Link>
      <button
        className='navbar-toggler'
        onClick={() => {
          setCollapse(collapse === 'collapse' ? '' : 'collapse')
        }}
        type='button'
        data-toggle='collapse'
        data-target='#navbarSupportedContent'
        aria-controls='navbarSupportedContent'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div
        className={`${collapse} navbar-collapse`}
        id='navbarSupportedContent'
      >
        <ul className='navbar-nav mr-auto'>
          <Link to='/Library'>
            <li
              className='nav-item'
              onClick={() => {
                setCollapse(collapse === 'collapse' ? '' : 'collapse')
              }}
            >
              Library
            </li>
          </Link>
          <li
            className='nav-item'
            onClick={() => {
              setCollapse(collapse === 'collapse' ? '' : 'collapse')
              if (isAuthenticated) {
                logout()
              } else {
                loginWithRedirect()
              }
            }}
          >
            {isAuthenticated ? 'Log out' : 'Log in'}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
