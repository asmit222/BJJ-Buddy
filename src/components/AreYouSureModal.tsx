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
  currBookNumberActual: number
}

const AreYouSureModal: React.FC<Props> = ({
  show,
  handleClose,
  handleDownloadBookOnModalClose,
  books,
  currBookNumber,
  currBookNumberActual,
  currRating,
  currDescription
}) => {
  return (
    <Modal centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body className='areYouSureModalBody'>
        {`It looks like you already downloaded ${books[currBookNumber]?.book
          .split('-')
          .slice(0, -1)
          .join('-')}
        by `}{' '}
        <span className='authorText'>{`${books[currBookNumber]?.book
          .split('-')
          .pop()
          .replace(')', '')}`}</span>
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
        <div
          style={{
            backgroundImage: `url(${`http://s3.amazonaws.com/froobs-kindle-books/${currBookNumberActual}.jpg`})`
          }}
          className='modalHeaderRightSide areYouSureBookIcon'
        ></div>
        {currDescription === '' ? (
          <i className=''></i>
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
