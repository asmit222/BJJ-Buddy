import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'

interface Props {
  show: boolean
  handleClose: () => void
  handleDownloadBookOnModalClose: () => void
  books: any[]
  currBookNumber: number
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
          <div>
            <Button variant='warning' size='sm' className='descriptionButton'>
              {/* view on goodreads */}
            </Button>
          </div>
          {currRating !== '' && <Ratings rating={Number(currRating)} />}
        </a>
      </Modal.Body>
      <Modal.Body
        className={`descriptionBody2 ${currDescription !== '' ? 'show' : ''}`}
      >
        {currDescription === '' ? (
          <i className='fas fa-spinner fa-spin fa-2x '></i>
        ) : (
          <div className='my-modal-content123'>{currDescription}</div>
        )}
      </Modal.Body>
      <Modal.Footer className='downloadBookModalFooter'>
        <Button variant='success' onClick={handleDownloadBookOnModalClose}>
          Download again
        </Button>
        <Button variant='dark' onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AreYouSureModal
