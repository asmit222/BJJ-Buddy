import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'

import LogoutButton from '../components/LogoutButton'

const Account: React.FC = (props) => {
  useEffect(() => {
    console.log(props.user)
  }, [])

  return (
    <React.Fragment>
      <div className='AccountTitleContainer'>
        <img
          src={
            props.user?.picture ||
            'https://i.pinimg.com/originals/71/f3/51/71f3519243d136361d81df71724c60a0.png'
          }
          className='userIcon'
        ></img>
      </div>
      <div className='AccountContainer'>
        <div className='shelvesTitleContainer'>
          <h1>Skills</h1>
        </div>

        <div className='logoutButtonContainer'>
          <LogoutButton />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Account
