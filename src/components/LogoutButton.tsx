import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from 'react-bootstrap/Button'

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0()

  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    setLoading(false)
  }

  return isAuthenticated ? (
    <Button variant='danger' size='sm' onClick={handleLogout} loading={loading}>
      Log Out
    </Button>
  ) : null
}

export default LogoutButton
