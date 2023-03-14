import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import { query, where, deleteDoc, doc } from 'firebase/firestore'
import Dropdown from 'react-bootstrap/Dropdown'

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

  const handleClickRead = async (bookNum) => {
    try {
      const docRef = await addDoc(collection(db, user?.sub), {
        readBook: bookNum
      })
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

  const handleClickDownloaded = async (bookNum) => {
    let bookString = bookNum.toString()
    try {
      const docRef = await addDoc(collection(db, user?.sub), {
        bookRead: bookString
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
      for (const docSnapshot of querySnapshot.docs) {
        console.log('deleting: ' + docSnapshot.id)
        await deleteDoc(doc(db, user?.sub, docSnapshot.id))
      }
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

  const handleDeleteDownloaded = async (bookNum) => {
    let bookString = bookNum.toString()
    try {
      const q = query(
        collection(db, user?.sub),
        where('bookRead', '==', bookString)
      )
      const querySnapshot = await getDocs(q)
      for (const docSnapshot of querySnapshot.docs) {
        console.log('deleting: ' + docSnapshot.id)
        await deleteDoc(doc(db, user?.sub, docSnapshot.id))
      }
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

  const handleDeleteRead = async (bookNum) => {
    try {
      const q = query(
        collection(db, user?.sub),
        where('readBook', '==', bookNum)
      )
      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        console.log('deleting: ' + docSnapshot.id)
        return deleteDoc(doc(db, user?.sub, docSnapshot.id))
      })

      await Promise.all(deletePromises)
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

          <Dropdown className='shelvesDropDown'>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
              Add to Shelf
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {!userData.shelfReadBooks?.includes(currBookNumberActual) ? (
                <Dropdown.Item
                  onClick={() => {
                    handleClickRead(currBookNumberActual)
                  }}
                  size='sm'
                  // className='to-read-button'
                  variant='dark'
                >
                  Read
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={() => {
                    handleDeleteRead(currBookNumberActual)
                  }}
                  size='sm'
                  // className='to-read-button-yes'
                  variant='success'
                >
                  <i className='to-read-check fa-solid fa-check'></i>Read
                </Dropdown.Item>
              )}

              {!userData.readingListBooks?.includes(currBookNumberActual) ? (
                <Dropdown.Item
                  onClick={() => {
                    handleClickToRead(currBookNumberActual)
                  }}
                  size='sm'
                  // className='to-read-button'
                  variant='dark'
                >
                  To-Read
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={() => {
                    handleDeleteToRead(currBookNumberActual)
                  }}
                  size='sm'
                  // className='to-read-button-yes'
                  variant='success'
                >
                  <i className='to-read-check fa-solid fa-check'></i>To-Read
                </Dropdown.Item>
              )}

              {!userData.readBooks?.includes(
                currBookNumberActual.toString()
              ) ? (
                <Dropdown.Item
                  onClick={() => {
                    handleClickDownloaded(currBookNumberActual.toString())
                  }}
                  size='sm'
                  // className='to-read-button'
                  variant='dark'
                >
                  Downloaded
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={() => {
                    handleDeleteDownloaded(currBookNumberActual.toString())
                  }}
                  size='sm'
                  // className='to-read-button-yes'
                  variant='success'
                >
                  <i className='to-read-check fa-solid fa-check'></i>Downloaded
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* {!userData.readingListBooks?.includes(currBookNumberActual) ? (
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
          )} */}
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
