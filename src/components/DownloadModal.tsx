import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'

interface DownloadModalProps {
  show: boolean
  handleClose: () => void
  handleDownloadBookOnModalClose: () => void
  books: any[]
  currBookNumber: number
  currRating: string
  currDescription: string
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  show,
  handleClose,
  handleDownloadBookOnModalClose,
  books,
  currBookNumber,
  currRating,
  currDescription
}) => {
  return (
    <Modal centered show={show} onHide={handleClose} className='my-modal123'>
      <Modal.Header>
        <Modal.Title>
          {`${books[currBookNumber]?.book}`}
          <a
            className='goodreadsLinkA'
            href={`http://www.google.com/search?q=goodreads ${books[currBookNumber]?.book}`}
            target='_blank'
          >
            <div>
              <Button variant='warning' size='sm' className='descriptionButton'>
                {/* view on goodreads */}
              </Button>
            </div>
            {currRating !== '' && <Ratings rating={Number(currRating)} />}
          </a>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={`descriptionBody ${currDescription !== '' ? 'show' : ''}`}
      >
        {currDescription === '' ? (
          <i className='fas fa-spinner fa-spin fa-2x '></i>
        ) : (
          <div className='my-modal-content123'>{currDescription}</div>
        )}
      </Modal.Body>
      <Modal.Footer className='downloadBookModalFooter'>
        <Button variant='success' onClick={handleDownloadBookOnModalClose}>
          Download
        </Button>
        <Button variant='dark' onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DownloadModal
