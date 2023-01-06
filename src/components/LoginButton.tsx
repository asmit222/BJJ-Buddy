import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from 'react-bootstrap/Button'

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <React.Fragment>
      <Button
        variant='primary'
        onClick={() => {
          loginWithRedirect()
        }}
      >
        Log In
      </Button>
    </React.Fragment>
  )
}

export default LoginButton
