import * as React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const SideNav: React.FC = (props) => {
  const [sideNavStatus, setSideNavStatus] = useState('SideNavOpen')
  const closeSideBar = () => {
    // props.setStatus('sideNavClosed')
  }

  // const codeProblems = Object.keys(problems).map((problem) => {
  //   return (
  //     <Link onClick={closeSideBar} to={`/${problem.split(' ').join('')}`}>

  //         <i className='sideNavCheckMark fa-solid fa-circle-check fa-xs'></i>

  //     </Link>
  //   )
  // })

  const handleChangeNonFictionSwitch = (e) => {
    props.setSwitchState(!props.switchState)
  }

  const handleChangeFictionSwitch = (e) => {
    props.setSwitchState2(!props.switchState2)
  }

  return (
    <div id='mySidenav' className={`sidenav ${props.sideNavStatus}`}>
      <a
        className='closebtn'
        onClick={() => {
          // props.setStatus('sideNavClosed')
        }}
      ></a>
      <Form className='filtersForm'>
        <div key={`default`} className='mb-3'>
          <Form.Check
            onChange={() => {
              console.log('checked fiction')
            }}
            type={'switch'}
            className='filterSelectionRadioButton'
            id={`default`}
            label={`Fiction`}
            defaultChecked={props.switchState2}
            onChange={handleChangeFictionSwitch}
          />
          <Form.Check
            onChange={() => {
              console.log('checked non-fiction')
            }}
            type={'switch'}
            className='filterSelectionRadioButton'
            id={`default`}
            label={`Non-Fiction`}
            defaultChecked={props.switchState}
            onChange={handleChangeNonFictionSwitch}
          />
        </div>
      </Form>
    </div>
  )
}

export default SideNav
