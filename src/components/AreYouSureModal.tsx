import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'

interface Props {
  show: boolean
  handleClose: () => void
  handleDownloadBookOnModalClose: () => void
  books: any[]
  currBookNumber: number | string
  currRating: string
  currDescription: string
}

const AreYouSureModal: React.FC<Props> = ({
  show,
  handleClose,
  handleDownloadBookOnModalClose,
  books,
  currBookNumber,
  currRating,
  currDescription
}) => {
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body className='areYouSureModalBody'>
        {`It looks like you already downloaded ${
          books[currBookNumber]?.book ?? ''
        }. `}
        <a
          className='goodreadsLinkA'
          href={`http://www.google.com/search?q=goodreads ${books[currBookNumber]?.book}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {currRating !== '' && <Ratings rating={Number(currRating)} />}
          <Button
            size='sm'
            variant='outline-dark'
            className='descriptionButton'
          >
            view on goodreads
          </Button>
        </a>
      </Modal.Body>
      <Modal.Body
        className={`descriptionBody2 ${currDescription !== '' ? 'show' : ''}`}
      >
        {currDescription === '' ? (
          <i className='fas fa-spinner fa-spin fa-lg'></i>
        ) : (
          <div className='my-modal-content123'>{currDescription}</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='dark' onClick={handleDownloadBookOnModalClose}>
          Download again
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AreYouSureModal
