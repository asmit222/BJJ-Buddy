import React, { FormEvent } from 'react'
import { Form } from 'react-bootstrap'

interface Props {
  user: any
  bookSearchValue: string
  handleSearchBooksChange: (event: FormEvent<HTMLInputElement>) => void
  setSideNavStatus: (status: string) => void
  sideNavStatus: string
}

const LibraryTitle: React.FC<Props> = ({
  user,
  bookSearchValue,
  handleSearchBooksChange,
  setSideNavStatus,
  sideNavStatus
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
    <h1>Library</h1>
    <Form className='searchBooksForm'>
      <Form.Group className='mb-0'>
        <Form.Control
          onClick={() => setSideNavStatus('sideNavClosed')}
          type='text'
          value={bookSearchValue}
          onChange={handleSearchBooksChange}
          placeholder='Search books'
        />
      </Form.Group>
    </Form>
    <span
      onClick={() =>
        setSideNavStatus(
          sideNavStatus === 'sideNavOpen' ? 'sideNavClosed' : 'sideNavOpen'
        )
      }
      className='filterButtonSpan'
    ></span>
  </div>
)
export default LibraryTitle
