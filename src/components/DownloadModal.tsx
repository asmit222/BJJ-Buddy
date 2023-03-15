import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Ratings from './Ratings'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import { query, where, deleteDoc, doc } from 'firebase/firestore'
import { Dropdown, Spinner } from 'react-bootstrap'

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
  const [show9, setShow9] = useState(false)
  const handleClose9 = () => setShow9(false)
  const [currShelf, setCurrShelf] = useState('')
  const [added, setAdded] = useState(true)
  const [isDropdownLoading, setIsDropdownLoading] = useState(false)

  const handleClick = async (
    bookNum: number,
    shelf: string,
    field: 'bookRead' | 'bookToRead'
  ) => {
    setIsDropdownLoading(true)
    setCurrShelf(shelf)

    try {
      const docRef = await addDoc(collection(db, user?.sub), {
        [field]: field === 'bookRead' ? bookNum.toString() : bookNum
      })

      await fetchData(true)
      handleAddedToShelfModalOpenAndClose()
    } catch (e) {
      console.error('Error adding document:', e)
    } finally {
      setIsDropdownLoading(false)
      setAdded(true)
    }
  }

  const handleDelete = async (
    bookNum: number,
    shelf: string,
    field: 'bookRead' | 'bookToRead'
  ) => {
    setIsDropdownLoading(true)
    setAdded(false)
    setCurrShelf(shelf)

    try {
      const q = query(
        collection(db, user?.sub),
        where(field, '==', field === 'bookRead' ? bookNum.toString() : bookNum)
      )

      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        console.log('deleting: ' + docSnapshot.id)
        return deleteDoc(doc(db, user?.sub, docSnapshot.id))
      })

      await Promise.all(deletePromises)
      await fetchData(true)
      handleAddedToShelfModalOpenAndClose()
    } catch (e) {
      console.error('Error deleting document:', e)
    } finally {
      setIsDropdownLoading(false)
    }
  }

  const handleAddedToShelfModalOpenAndClose = () => {
    setShow9(true)
    setIsDropdownLoading(false)

    setTimeout(() => {
      setShow9(false)
      setCurrShelf('')
      setAdded(true)
    }, 1500)
  }

  const renderShelfDropdownItem = (
    shelfArray: string[] | undefined,
    bookNum: number | string,
    shelfName: string,
    fieldName: string,
    handleClick: Function,
    handleDelete: Function,
    buttonLabel: string,
    checkIconClass: string
  ) => {
    const includesBook = shelfArray?.includes(bookNum)
    const onClick = includesBook
      ? () => handleDelete(bookNum, shelfName, fieldName)
      : () => handleClick(bookNum, shelfName, fieldName)
    const variant = includesBook ? 'success' : 'dark'

    return (
      <Dropdown.Item
        className={shelfName !== 'Downloaded' ? 'shelfDropdownItem' : ''}
        onClick={onClick}
        size='sm'
        variant={variant}
      >
        {includesBook && <i className={checkIconClass}></i>}
        {buttonLabel}
      </Dropdown.Item>
    )
  }

  return (
    <React.Fragment>
      <Modal
        className='bookRequestModal'
        centered
        show={show9}
        onHide={handleClose9}
        animation
      >
        <Modal.Header>
          <Modal.Title>{`${added ? 'Added' : 'Removed'} ${books[
            currBookNumber
          ]?.book
            .split('-')
            .slice(0, -1)
            .join('-')} ${added ? 'to' : 'from'} ${currShelf}`}</Modal.Title>
        </Modal.Header>
      </Modal>
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
              <Dropdown.Toggle
                variant='success'
                id='dropdown-basic'
                disabled={isDropdownLoading}
              >
                {isDropdownLoading ? (
                  <>
                    <Spinner
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />{' '}
                    Loading
                  </>
                ) : (
                  'Add to Shelf'
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {renderShelfDropdownItem(
                  userData.shelfReadBooks,
                  currBookNumberActual,
                  'Read',
                  'readBook',
                  handleClick,
                  handleDelete,
                  'Read',
                  'to-read-check fa-solid fa-check'
                )}
                {renderShelfDropdownItem(
                  userData.readingListBooks,
                  currBookNumberActual,
                  'To-Read',
                  'readingListBook',
                  handleClick,
                  handleDelete,
                  'To-Read',
                  'to-read-check fa-solid fa-check'
                )}
                {renderShelfDropdownItem(
                  userData.readBooks,
                  currBookNumberActual.toString(),
                  'Downloaded',
                  'bookRead',
                  handleClick,
                  handleDelete,
                  'Downloaded',
                  'to-read-check fa-solid fa-check'
                )}
              </Dropdown.Menu>
            </Dropdown>
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
            {userData?.readBooks?.includes(currBookNumberActual.toString())
              ? 'Download Again'
              : 'Download'}
          </Button>
          <Button variant='dark' onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  )
}

export default DownloadModal
