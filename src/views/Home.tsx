import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Home: React.FC = (props) => {
  const { user } = useAuth0()
  const { loginWithRedirect } = useAuth0()
  const { logout, isAuthenticated } = useAuth0()

  // ================ RUN ON PAGE LOAD ======================
  useEffect(() => {
    console.log('Home page loaded')
  }, [])
  // =========================================================

  return (
    <React.Fragment>
      <div className='HomeContainer'>
        <div className='HomeTitleContainer'>
          <span className='froobsBooksLogo'></span>
          <h1 className='stepsTitle'>Home</h1>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home
