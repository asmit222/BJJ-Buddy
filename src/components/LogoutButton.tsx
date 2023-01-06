import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from 'react-bootstrap/Button'

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0()

  const [logoutButtonClassName, setLogoutButtonClassName] = useState('')

  return (
    isAuthenticated && (
      <React.Fragment>
        <Button
          className='logoutButton'
          variant='danger'
          size='sm'
          onClick={() => {
            // localStorage.clear()
            logout()
            // setLogoutButtonClassName('is-loading')
          }}
        >
          Log Out
        </Button>
      </React.Fragment>
    )
  )
}

export default LogoutButton
