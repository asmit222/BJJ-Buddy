import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'

const Account: React.FC = (props) => {
  useEffect(() => {
    console.log(props.user)
  }, [])

  return (
    <React.Fragment>
      <div className='AccountTitleContainer'>
        <img src={props.user?.picture} className='userIcon'></img>
      </div>
      <div className='AccountContainer'>hi</div>
    </React.Fragment>
  )
}

export default Account
