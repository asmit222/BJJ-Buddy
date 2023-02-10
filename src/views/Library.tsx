import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import booksObject from '../utils/books.js'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import SideNav from '../components/SideNav'
import LibraryTitle from '../components/LibraryTitle'
import KindleEmailForm from '../components/KindleEmailForm'

const Library: React.FC = () => {
  const { user } = useAuth0()
  const [userIdentifier, setUserIdentifier]: any = useState('')
  const [data, setData] = useState<any[]>([])
  const [kindleEmailFromFirestore, setKindleEmailFromFirestore] = useState('')
  const [userData, setUserData] = useState<{ [key: string]: any }>({})

  const [showKindleEmailForm, handleShowKindleEmailForm] = useState(false)

  // ================= PROCESS DATA TO ORGANIZE INTO ONE OBJ ====================
  const processData = () => {
    let tempUserData: { [key: string]: any } = {}
    let tempBookReadArr = []

    let mostRecentTime = 0
    for (let dataItem of data) {
      if (dataItem.bookRead) {
        tempBookReadArr.push(dataItem.bookRead)
      }
      if (dataItem.kindleEmail) {
        if (
          dataItem.timeAdded &&
          (mostRecentTime === 0 || Number(dataItem.timeAdded) > mostRecentTime)
        ) {
          mostRecentTime = Number(dataItem.timeAdded)
          tempUserData['kindleEmail'] = dataItem.kindleEmail
        }
      }
      if (dataItem.downloadedBefore !== undefined) {
        tempUserData['downloadedBefore'] = dataItem.downloadedBefore
      }
    }
    tempUserData['readBooks'] = tempBookReadArr
    setUserData(tempUserData)
  }
  // ============================================================================

  useEffect(() => {
    if (data.length) {
      processData()
    }
  }, [data])

  useEffect(() => {
    if (Object.keys(userData).length !== 0) {
      setKindleEmail(userData['kindleEmail'])
    }
  }, [userData])

  // ============ pull down latest user data ========================
  const fetchData = async () => {
    let newData = []

    try {
      const querySnapshot = await getDocs(collection(db, user?.sub))
      newData = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      setData(newData)
    } catch (error) {
      console.error(error)
    }
  }

  // ==========================================================

  useEffect(() => {
    if (kindleEmailFromFirestore !== '') {
      setKindleFormFieldClassName('kindleEmailFormFieldGreen')
      setKindleEmail(kindleEmailFromFirestore)
    }
  }, [kindleEmailFromFirestore])

  // ================ RUN ON PAGE LOAD ======================
  useEffect(() => {
    sortBooksAlphabetically()
  }, [])

  useEffect(() => {
    setUserIdentifier(user?.sub)
    console.log('user: ' + user?.sub)
    if (user?.sub !== undefined) {
      fetchData()
    }
  }, [user])

  // ==================================================================

  const sortBooksAlphabetically = () => {
    const booksArray: Book[] = Object.values(books).sort((a, b) =>
      a.book.toUpperCase().localeCompare(b.book.toUpperCase())
    )

    const newObj = booksArray.reduce((acc, book, i) => {
      acc[i] = { template: book.template, book: book.book, genres: book.genres }
      return acc
    }, {} as { [key: string]: Book })

    setBooks(newObj)
  }

  // ======================== STATES ================================
  const [books, setBooks] = useState(booksObject.data)
  const [currBookNumber, setCurrBookNumber] = useState('')
  const [kindleEmail, setKindleEmail] = useState('')
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(true)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [show5, setShow5] = useState(false)
  const [show6, setShow6] = useState(false)
  const [show10, setShow10] = useState(false)
  const [kindleFormFieldClassName, setKindleFormFieldClassName] = useState('')
  const [bookSearchValue, setBookSearchValue] = useState('')
  const [sideNavStatus, setSideNavStatus] = useState<string>('sideNavClosed')
  const [switchState, setSwitchState] = useState(true)
  const [switchState2, setSwitchState2] = useState(true)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleClose3 = () => {
    setShow3(false)
  }
  const handleClose4 = () => setShow4(false)
  const handleClose5 = () => setShow5(false)
  const handleClose6 = () => setShow6(false)
  const handleClose10 = () => setShow10(false)
  const handleShow3 = () => setShow3(true)
  // ================================================================
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleSearchBooksChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setBookSearchValue(e.target.value)
  }

  const setKindleEmailAndSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.sub) {
      setShow10(true)
      return
    }

    const value = e.target.value
    if (isNotValidEmail(value)) {
      setKindleFormFieldClassName(value === '' ? '' : 'kindleEmailFormFieldRed')
    } else {
      setKindleFormFieldClassName('kindleEmailFormFieldGreen')
      handleShowKindleEmailForm(false)
    }

    setKindleEmail(value)
  }

  const bookClickHandler = (bookNum: string) => {
    if (sideNavStatus === 'sideNavOpen') {
      setSideNavStatus('sideNavClosed')
      return
    }

    if (!user?.sub) {
      setShow10(true)
      return
    }

    if (isNotValidEmail(kindleEmail)) {
      alert('Please enter a valid Kindle email address.')
      return
    }

    const book = books[bookNum].book
    const bookNumKey = Object.keys(booksObject.data).find(
      (key) => booksObject.data[key].book === book
    )

    if (!bookNumKey) {
      return
    }

    if (userData.readBooks?.includes(bookNumKey)) {
      submitGetBook(bookNum)
    } else {
      submitGetBook2(bookNum)
    }
  }

  const submitGetBook = (bookNum: string) => {
    setCurrBookNumber(bookNum)
    handleShow()
  }

  const submitGetBook2 = (bookNum: string) => {
    setCurrBookNumber(bookNum)
    handleShow3()
  }

  const isNotValidEmail = (email: string) => {
    return !email.includes('@kindle.com')
  }

  const updateKindleEmailForAccountIfNeed = async () => {
    try {
      const docRef = await addDoc(collection(db, user?.sub), {
        kindleEmail,
        timeAdded: Date.now()
      })
      await fetchData()
    } catch (e) {
      console.error('Error adding document:', e)
    }
  }

  const setDownloadedBeforeIfNeed = async () => {
    if (!userData.downloadedBefore) {
      try {
        const docRef = await addDoc(collection(db, user?.sub), {
          downloadedBefore: true,
          userInfo: user
        })
        await fetchData()
      } catch (e) {
        console.error('Error adding document:', e)
      }
    }
  }

  // ====================== ACTUALLY DOWNLOAD BOOK =============================================
  const addBook = async (bookNum: string) => {
    if (isNotValidEmail(kindleEmail)) {
      alert('Please enter a valid Kindle email address')
      return
    }

    await updateKindleEmailForAccountIfNeed()
    await setDownloadedBeforeIfNeed()

    // ===== get correct book num from booksObject ==========
    let num: string
    let book: string
    let filetype: string
    for (const objKey in booksObject.data) {
      if (booksObject.data[objKey].book === books[currBookNumber].book) {
        num = objKey
        book = booksObject.data[objKey].book
        filetype = booksObject.data[objKey].filetype || 'epub'
        break
      }
    }
    // ======================================================

    const url = process.env.REQUEST_URL || 'http://localhost:3000'

    try {
      const response = await axios.get(
        `${url}/getBook/${num}/${kindleEmail}/${book}/${filetype}`
      )

      if (response.status === 200) {
        console.log('SUCCESS!', response.status, response.statusText)
        setShow6(false)
        setShow5(true)
        setTimeout(() => {
          setShow5(false)
        }, 1500)

        if (user?.sub) {
          try {
            const docRef = await addDoc(collection(db, user?.sub), {
              bookRead: num
            })
            await fetchData()
          } catch (e) {
            console.error('Error adding document:', e)
          }
        }
      } else {
        setShow6(false)
        console.log('FAILED...')
        alert('unexpected error')
      }
    } catch (e) {
      console.error('Error fetching book:', e)
    }
  }

  // =====================================================================================

  const handleDownloadBookOnModalClose = () => {
    addBook(currBookNumber) // <-- This one actually downloads the book
    setCurrBookNumber('')
    handleClose()
    handleClose3()
    setShow6(true)

    if (!userData.downloadedBefore) {
      setShow4(true)
    }
  }

  // ================================= BOOK BUTTONS ===================================
  const bookButtons = Object.keys(books)
    .filter((key) => {
      const allowedGenres = []
      if (switchState2) allowedGenres.push('fiction')
      if (switchState) allowedGenres.push('non-fiction')
      return (
        allowedGenres.some((genre) => books[key].genres?.includes(genre)) &&
        books[key].book.toLowerCase().includes(bookSearchValue.toLowerCase())
      )
    })
    .map((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )
      const imageUrl = `http://s3.amazonaws.com/froobs-kindle-books/${num}.jpg`
      return (
        <span
          key={key}
          style={{
            minWidth: '102px',
            height: '20vh',
            maxHeight: '150px',
            minHeight: '135px',
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
          className={`bookButton bookButton${num} ${
            sideNavStatus === 'sideNavOpen'
              ? 'bookButtonsLowOpacity'
              : 'bookButtonsfullOpacity'
          }`}
          onClick={() => bookClickHandler(key)}
        >
          {userData.readBooks?.includes(num) && (
            <h4 className='ribbon'>Downloaded</h4>
          )}
        </span>
      )
    })

  // ===================================================================================

  return (
    <React.Fragment>
      <div className='LibraryContainer'>
        <SideNav
          sideNavStatus={sideNavStatus}
          setSwitchState={setSwitchState}
          setSwitchState2={setSwitchState2}
          switchState={switchState}
          switchState2={switchState2}
        />

        {/* ========================== DOWNLOADING AND SUCCESS MODALS =============================== */}
        <Modal
          className=''
          centered
          show={show6}
          onHide={handleClose6}
          animation={true}
        >
          <Modal.Header>
            <Modal.Title className='modalTitleDownloading'>
              <i className='fas downloading-spinner fa-sync fa-spin fa-lg'></i>
              Downloading...
            </Modal.Title>
          </Modal.Header>
        </Modal>

        <Modal
          className='bookRequestModal'
          centered
          show={show5}
          onHide={handleClose5}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
        </Modal>
        {/* =============================================================================== */}

        {/* =========================== FIRST DOWNLOAD MODAL ======================================= */}
        <Modal centered show={show4} onHide={handleClose4}>
          <Modal.Header closeButton>
            <Modal.Title>Congrats on your first book download!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Don't forget to press "Sync" on your kindle in the drop-down menu to
            get the books to show up!
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={handleClose4}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ==================================================================================== */}

        <Modal centered show={show10} onHide={handleClose10}>
          <Modal.Header>
            <Modal.Title>Log in to start downloading books</Modal.Title>
            <Button variant='primary' onClick={handleLogin}>
              Login
            </Button>
          </Modal.Header>

          {/* <Modal.Footer>
            <Button variant='primary' onClick={handleLogin}>
              Login
            </Button>
          </Modal.Footer> */}
        </Modal>

        {/* ============================ ALREADY DOWNLOADED MODAL ======================== */}
        <Modal centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {`It looks like you already downloaded ${
              books[currBookNumber] !== undefined &&
              books[currBookNumber]['book']
            }.`}{' '}
            <a
              className='goodreadsLinkA'
              href={`http://www.google.com/search?q=goodreads ${books[currBookNumber]?.book}`}
              target='_blank'
            >
              {' '}
              <Button
                size='sm'
                variant='outline-dark'
                className='descriptionButton'
              >
                view on goodreads
              </Button>
            </a>
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
        {/* ================================================================================ */}

        {/* ============================ DOWNLOAD MODAL =================================== */}
        <Modal centered show={show3} onHide={handleClose3}>
          <Modal.Header>
            <Modal.Title>
              {`Download "${books[currBookNumber]?.book}"`}
              <a
                className='goodreadsLinkA'
                href={`http://www.google.com/search?q=goodreads ${books[currBookNumber]?.book}`}
                target='_blank'
              >
                <Button
                  size='sm'
                  variant='outline-dark'
                  className='descriptionButton'
                >
                  view on goodreads
                </Button>
              </a>
            </Modal.Title>
          </Modal.Header>
          {/* <Modal.Body className='descriptionBody'>
    {books[currBookNumber] !== undefined &&
      books[currBookNumber]['description']}
  </Modal.Body> */}
          <Modal.Footer>
            <Button variant='dark' onClick={handleDownloadBookOnModalClose}>
              Download
            </Button>
            <Button variant='danger' onClick={handleClose3}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ========================================================================== */}

        <LibraryTitle
          user={user}
          bookSearchValue={bookSearchValue}
          handleSearchBooksChange={handleSearchBooksChange}
          setSideNavStatus={setSideNavStatus}
          sideNavStatus={sideNavStatus}
        />

        <KindleEmailForm
          kindleEmail={kindleEmail}
          isNotValidEmail={isNotValidEmail}
          showKindleEmailForm={showKindleEmailForm}
          setSideNavStatus={setSideNavStatus}
          setKindleEmailAndSave={setKindleEmailAndSave}
          handleShowKindleEmailForm={handleShowKindleEmailForm}
          kindleFormFieldClassName={kindleFormFieldClassName}
        />

        <div
          onClick={() => {
            setSideNavStatus('sideNavClosed')
          }}
          className='bookButtonsContainer'
        >
          {bookButtons}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Library
