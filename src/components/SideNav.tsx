import * as React from 'react'
import { Form, Button } from 'react-bootstrap'

type SideNavProps = {
  sideNavStatus: string
  switchState: boolean
  setSwitchState: (value: boolean) => void
  switchState2: boolean
  setSwitchState2: (value: boolean) => void
  switchState3: boolean
  setSwitchState3: (value: boolean) => void
  switchState4: boolean
  setSwitchState4: (value: boolean) => void
  switchState5: boolean
  setSwitchState5: (value: boolean) => void
}

const SideNav: React.FC<SideNavProps> = ({
  sideNavStatus,
  switchState,
  setSwitchState,
  switchState2,
  setSwitchState2,
  switchState3,
  setSwitchState3,
  switchState4,
  setSwitchState4,
  switchState5,
  setSwitchState5
}) => {
  const handleChangeNonFictionSwitch = () => {
    setSwitchState(!switchState)
  }

  const handleChangeFictionSwitch = () => {
    setSwitchState2(!switchState2)
  }

  const handleChangeReadSwitch = () => {
    setSwitchState3(!switchState3)
  }

  const handleChangeToReadSwitch = () => {
    setSwitchState4(!switchState4)
  }

  const handleChangeDownloadedSwitch = () => {
    setSwitchState5(!switchState5)
  }

  return (
    <div className={`sidenav ${sideNavStatus}`}>
      <Form className='filtersForm'>
        <h5 className='genresFilterTitle'>Genres:</h5>
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

      <Form className='filtersForm2'>
        <h5 className='genresFilterTitle'>Shelves:</h5>
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Read'
          label='Read'
          defaultChecked={switchState3}
          onChange={handleChangeReadSwitch}
        />
        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='To-Read'
          label='To-Read'
          defaultChecked={switchState4}
          onChange={handleChangeToReadSwitch}
        />

        <Form.Check
          type='switch'
          className='filterSelectionRadioButton'
          id='Downloaded'
          label='Downloaded'
          defaultChecked={switchState5}
          onChange={handleChangeDownloadedSwitch}
        />
      </Form>
    </div>
  )
}

export default SideNav
