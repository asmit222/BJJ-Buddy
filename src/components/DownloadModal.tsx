import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import { query, where, deleteDoc, doc } from 'firebase/firestore'

interface DownloadModalProps {
  user: any
  fetchData: any
  show: boolean
  handleClose: () => void
  handleDownloadBookOnModalClose: () => void
  books: any[]
  currBookNumber: number
  currRating: string
  currDescription: string
  currBookNumberActual: number
  userData: any
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  user,
  fetchData,
  userData,
  show,
  handleClose,
  handleDownloadBookOnModalClose,
  books,
  currBookNumber,
  currBookNumberActual,
  currRating,
  currDescription
}) => {
  const handleClickToRead = async (bookNum) => {
    try {
      const docRef = await addDoc(collection(db, user?.sub), {
        readingListBook: bookNum
      })
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

  const handleDeleteToRead = async (bookNum) => {
    try {
      const q = query(
        collection(db, user?.sub),
        where('readingListBook', '==', bookNum)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((docSnapshot) => {
        console.log('deleting: ' + docSnapshot.id)
        deleteDoc(doc(db, user?.sub, docSnapshot.id))
      })
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

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
              <Button variant='light' size='sm' className='descriptionButton'>
                {/* view on goodreads */}
              </Button>
            </div>
          </a>

          {currRating !== '' && <Ratings rating={Number(currRating)} />}
          {!userData.readingListBooks?.includes(currBookNumberActual) ? (
            <Button
              onClick={() => {
                handleClickToRead(currBookNumberActual)
              }}
              size='sm'
              className='to-read-button'
              variant='dark'
            >
              to-read
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleDeleteToRead(currBookNumberActual)
              }}
              size='sm'
              className='to-read-button-yes'
              variant='success'
            >
              <i className='to-read-check fa-solid fa-check'></i>to-read
            </Button>
          )}
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
