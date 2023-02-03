import * as React from 'react'
import { Form, Button } from 'react-bootstrap'

const SideNav: React.FC = (props) => {
  const handleChangeNonFictionSwitch = (e) => {
    props.setSwitchState(!props.switchState)
  }

  const handleChangeFictionSwitch = (e) => {
    props.setSwitchState2(!props.switchState2)
  }

  return (
    <div className={`sidenav ${props.sideNavStatus}`}>
      <Form className='filtersForm'>
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Fiction'
          label='Fiction'
          defaultChecked={props.switchState2}
          onChange={handleChangeFictionSwitch}
        />
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Non-Fiction'
          label='Non-Fiction'
          defaultChecked={props.switchState}
          onChange={handleChangeNonFictionSwitch}
        />
      </Form>
    </div>
  )
}

export default SideNav
