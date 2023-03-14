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
import AreYouSureModal from '../components/AreYouSureModal'
import DownloadModal from '../components/DownloadModal'

const Library: React.FC = () => {
  const { user } = useAuth0()
  const [userIdentifier, setUserIdentifier]: any = useState('')
  const [data, setData] = useState<any[]>([])
  const [kindleEmailFromFirestore, setKindleEmailFromFirestore] = useState('')
  const [userData, setUserData] = useState<{ [key: string]: any }>({})

  const [showKindleEmailForm, handleShowKindleEmailForm] = useState(false)
  const [currDescription, setCurrDescription] = useState('')
  const [currRating, setCurrRating] = useState('')
  const [currBookNumberActual, setCurrBookNumberActual] = useState('')

  // ================= PROCESS DATA TO ORGANIZE INTO ONE OBJ ====================
  const processData = () => {
    const tempUserData = {}
    const tempBookReadArr = []
    const tempReadingListArr = []
    const tempReadArr = []

    let mostRecentTime = 0
    for (const dataItem of data) {
      if (dataItem.bookRead) {
        tempBookReadArr.push(dataItem.bookRead)
      }
      if (dataItem.readingListBook) {
        tempReadingListArr.push(dataItem.readingListBook)
      }
      if (dataItem.readBook) {
        tempReadArr.push(dataItem.readBook)
      }
      if (
        dataItem.kindleEmail &&
        dataItem.timeAdded &&
        Number(dataItem.timeAdded) > mostRecentTime
      ) {
        mostRecentTime = Number(dataItem.timeAdded)
        tempUserData.kindleEmail = dataItem.kindleEmail
      }
      if (dataItem.downloadedBefore !== undefined) {
        tempUserData.downloadedBefore = dataItem.downloadedBefore
      }
    }

    tempUserData.readBooks = tempBookReadArr
    tempUserData.readingListBooks = tempReadingListArr
    tempUserData.shelfReadBooks = tempReadArr
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
      console.log('userData: ' + JSON.stringify(userData))
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
    console.log(user?.name)
    if (user?.sub !== undefined) {
      fetchData()
    }
  }, [user])

  // ==================================================================

  const sortBooksAlphabetically = () => {
    const booksArray: any[] = Object.values(books).sort((a: any, b: any) =>
      a.book.toUpperCase().localeCompare(b.book.toUpperCase())
    )

    const newObj = booksArray.reduce((acc, book, i) => {
      acc[i] = { template: book.template, book: book.book, genres: book.genres }
      return acc
    }, {} as { [key: string]: any })

    setBooks(newObj)
  }

  // ======================== STATES ================================
  const [books, setBooks] = useState(booksObject.data)
  const [currBookNumber, setCurrBookNumber] = useState('')
  const [kindleEmail, setKindleEmail] = useState('')
  const [show, setShow] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [show5, setShow5] = useState(false)
  const [show7, setShow7] = useState(false)
  const [show6, setShow6] = useState(false)
  const [show10, setShow10] = useState(false)
  const [kindleFormFieldClassName, setKindleFormFieldClassName] = useState('')
  const [bookSearchValue, setBookSearchValue] = useState('')
  const [sideNavStatus, setSideNavStatus] = useState<string>('sideNavClosed')
  const [switchState, setSwitchState] = useState(true)
  const [switchState2, setSwitchState2] = useState(true)

  const handleClose = () => {
    setShow(false)
    setCurrBookNumber('')
    setCurrDescription('')
    setCurrRating('')
  }
  const handleShow = () => setShow(true)
  const handleClose3 = () => {
    setCurrBookNumber('')
    setCurrDescription('')
    setCurrRating('')
    setShow3(false)
  }
  const handleClose4 = () => setShow4(false)
  const handleClose5 = () => setShow5(false)
  const handleClose6 = () => setShow6(false)
  const handleClose7 = () => setShow7(false)
  const handleClose10 = () => setShow10(false)
  const handleShow3 = () => setShow3(true)
  // ================================================================
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    loginWithRedirect()
  }

  const clearSearchBox = () => {
    setBookSearchValue('')
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

    setCurrBookNumberActual(bookNumKey)

    if (userData.readBooks?.includes(bookNumKey)) {
      submitGetBook(bookNum)
    } else {
      submitGetBook2(bookNum)
    }
  }

  const setGoogleBooksApiInfo = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${
          books[currBookNumber]?.book.split('-')[0]
        }`
      )
      const data = await response.json()
      if (data.items[0]?.volumeInfo) {
        const { description, averageRating } = data.items[0].volumeInfo
        if (description) setCurrDescription(description)
        if (averageRating) setCurrRating(averageRating)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (currBookNumber) {
      setGoogleBooksApiInfo()
    }
  }, [currBookNumber])

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
        `${url}/getBook/${num}/${kindleEmail}/${book}/${filetype}/${user?.name}`
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
        handleSomethingWentWrongDownloading()
      }
    } catch (e) {
      handleSomethingWentWrongDownloading()
    }
  }

  const handleSomethingWentWrongDownloading = (e = null) => {
    setShow6(false)
    setShow7(true)
    setTimeout(() => {
      setShow7(false)
    }, 1500)
    // alert('unexpected error')
    if (e) {
      console.error('Error fetching book:', e)
    }
  }

  // =====================================================================================

  const handleDownloadBookOnModalClose = () => {
    addBook(currBookNumber) // <-- This one actually downloads the book
    setCurrBookNumber('')
    setCurrDescription('')
    setCurrRating('')
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
            maxHeight: '300px',
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
          {userData.readingListBooks?.includes(Number(num)) &&
            !userData.readBooks?.includes(num) &&
            !userData.shelfReadBooks?.includes(Number(num)) && (
              <h4 className='ribbon2'>To-Read</h4>
            )}
          {userData.readBooks?.includes(num) &&
            !userData.shelfReadBooks?.includes(Number(num)) && (
              <h4 className='ribbon'>Downloaded</h4>
            )}
          {userData.shelfReadBooks?.includes(Number(num)) && (
            <h4 className='ribbon3'>Read</h4>
          )}
        </span>
      )
    })

  // ===================================================================================

  return (
    <React.Fragment>
      <div
        className={
          showKindleEmailForm ? 'LibraryContainer2' : 'LibraryContainer'
        }
      >
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

        <Modal
          className='somethingWentWrongModal'
          centered
          show={show7}
          onHide={handleClose7}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Something went wrong <i className='fa-regular fa-face-frown'></i>
            </Modal.Title>
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
        </Modal>

        {/* ============================ ALREADY DOWNLOADED MODAL ======================== */}
        <AreYouSureModal
          user={user}
          fetchData={fetchData}
          userData={userData}
          show={show}
          handleClose={handleClose}
          handleDownloadBookOnModalClose={handleDownloadBookOnModalClose}
          books={books}
          currBookNumber={Number(currBookNumber)}
          currBookNumberActual={Number(currBookNumberActual)}
          currRating={currRating}
          currDescription={currDescription}
        />
        {/* ================================================================================ */}

        {/* ============================ DOWNLOAD MODAL =================================== */}
        <DownloadModal
          user={user}
          fetchData={fetchData}
          userData={userData}
          show={show3}
          handleClose={handleClose3}
          books={books}
          currBookNumber={Number(currBookNumber)}
          currBookNumberActual={Number(currBookNumberActual)}
          currRating={currRating}
          currDescription={currDescription}
          handleDownloadBookOnModalClose={handleDownloadBookOnModalClose}
        />
        {/* ========================================================================== */}

        <LibraryTitle
          clearSearchBox={clearSearchBox}
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
