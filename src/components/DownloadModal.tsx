import React, { useEffect } from 'react'
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
  currBookNumberActual: number
}

const DownloadModal: React.FC<DownloadModalProps> = ({
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
    <Modal centered show={show} onHide={handleClose} className='my-modal123'>
      <Modal.Header>
        <Modal.Title className='downloadModalTitle'>
          <div className='bookTitleText'>{`${books[currBookNumber]?.book
            .split('-')
            .slice(0, -1)
            .join('-')}`}</div>
          <div className='authorText'>{`${books[currBookNumber]?.book
            .split('-')
            .pop()
            .replace(')', '')}`}</div>
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
        <div
          style={{
            backgroundImage: `url(${`http://s3.amazonaws.com/froobs-kindle-books/${currBookNumberActual}.jpg`})`
          }}
          className='modalHeaderRightSide'
        ></div>
      </Modal.Header>
      <Modal.Body
        className={`descriptionBody ${currDescription !== '' ? 'show' : ''}`}
      >
        {currDescription === '' ? (
          <i className='fa-solid fa-rotate fa-3x fa-spin'></i>
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
