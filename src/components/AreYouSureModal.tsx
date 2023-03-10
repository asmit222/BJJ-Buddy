import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import { query, where, deleteDoc, doc } from 'firebase/firestore'

interface Props {
  user: any
  fetchData: any
  userData: any
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
