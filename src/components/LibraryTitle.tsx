import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
  user: any
  bookSearchValue: string
  handleSearchBooksChange: React.ChangeEventHandler<HTMLInputElement>
  setSideNavStatus: (status: string) => void
  sideNavStatus: string
  clearSearchBox: any
}

const LibraryTitle: React.FC<Props> = ({
  user,
  bookSearchValue,
  handleSearchBooksChange,
  setSideNavStatus,
  sideNavStatus,
  clearSearchBox
}) => (
  <div className='libraryTitleContainer'>
    <div
      className='emailPicDiv'
      style={{
        backgroundImage: `url(${user?.picture})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
      }}
    ></div>
    <h1 className='LibraryTitle' onClick={clearSearchBox}>
      Videos
    </h1>

    {/* <Form className='searchBooksForm'>
      <Form.Group className='mb-0'>
        <Form.Control
          onClick={() => setSideNavStatus('sideNavClosed')}
          type='text'
          value={bookSearchValue}
          onChange={handleSearchBooksChange}
          placeholder='Search videos'
        />
      </Form.Group>
    </Form> */}

    {/* <span
      onClick={() =>
        setSideNavStatus(
          sideNavStatus === 'sideNavOpen' ? 'sideNavClosed' : 'sideNavOpen'
        )
      }
      className='filterButtonSpan'
    ></span> */}
  </div>
)

export default LibraryTitle
