import * as React from 'react'
import { Form, Button } from 'react-bootstrap'

type SideNavProps = {
  sideNavStatus: string
  switchState: boolean
  setSwitchState: (value: boolean) => void
  switchState2: boolean
  setSwitchState2: (value: boolean) => void
}

const SideNav: React.FC<SideNavProps> = ({
  sideNavStatus,
  switchState,
  setSwitchState,
  switchState2,
  setSwitchState2
}) => {
  const handleChangeNonFictionSwitch = () => {
    setSwitchState(!switchState)
  }

  const handleChangeFictionSwitch = () => {
    setSwitchState2(!switchState2)
  }

  return (
    <div className={`sidenav ${sideNavStatus}`}>
      <Form className='filtersForm'>
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Fiction'
          label='Fiction'
          defaultChecked={switchState2}
          onChange={handleChangeFictionSwitch}
        />
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Non-Fiction'
          label='Non-Fiction'
          defaultChecked={switchState}
          onChange={handleChangeNonFictionSwitch}
        />
      </Form>
    </div>
  )
}

export default SideNav
