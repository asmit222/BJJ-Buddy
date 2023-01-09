import React, { useState, useEffect, Props } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import booksObject from '../utils/books.js'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import SideNav from '../components/SideNav.tsx'

const Library: React.FC = () => {
  const { user } = useAuth0()
  const [userIdentifier, setUserIdentifier]: any = useState('')
  const [data, setData] = useState([])
  const [kindleEmailFromFirestore, setKindleEmailFromFirestore] = useState('')
  const [userData, setUserData] = useState({})

  // ================= PROCESS DATA TO ORGANIZE INTO ONE OBJ ====================
  const processData = () => {
    let tempUserData = {}
    let tempBookReadArr = []

    for (let dataItem of data) {
      if (dataItem.bookRead) {
        tempBookReadArr.push(dataItem.bookRead)
      }
      if (dataItem.kindleEmail) {
        setKindleEmailFromFirestore(dataItem.kindleEmail)
        tempUserData['kindleEmail'] = dataItem.kindleEmail
      }
      if (dataItem.downloadedBefore) {
        tempUserData['downloadedBefore'] = true
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
    if (userData.length !== 0) {
      console.log('userData: ' + JSON.stringify(userData))
    }
  }, [userData])

  // ============ pull down latest user data ========================
  const fetchData = async () => {
    let newData: ((prevState: never[]) => never[]) | { id: string }[]

    await getDocs(collection(db, user?.sub))
      .then((querySnapshot) => {
        newData = querySnapshot.docs.map((doc) => ({
          ...doc.data()
        }))
        // .filter((doc) => {return doc['userID'] === user?.sub})
      })
      .then(() => {
        setData(newData)
      })
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
    let bookArr = []
    for (let key in books) {
      let tempArr = []
      tempArr.push(books[key].template)
      tempArr.push(books[key].book)
      tempArr.push(books[key].genres)
      bookArr.push(tempArr)
    }
    bookArr.sort((a, b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()))
    let newObj = {}
    bookArr.forEach((book, i) => {
      newObj[i] = { template: book[0], book: book[1], genres: book[2] }
    })
    setBooks(newObj)
    console.log(newObj)
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
  const handleClose3 = () => setShow3(false)
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

  const setKindleEmailAndSave = (e: any) => {
    if (!user?.sub) {
      setShow10(true)
      return
    }

    if (isNotValidEmail(e.target.value)) {
      if (e.target.value === '') {
        setKindleFormFieldClassName('')
      } else {
        setKindleFormFieldClassName('kindleEmailFormFieldRed')
      }
    } else {
      setKindleFormFieldClassName('kindleEmailFormFieldGreen')
    }

    setKindleEmail(e.target.value)
  }

  const bookClickHandler = (bookNum: string) => {
    setSideNavStatus('sideNavClosed')
    if (!user?.sub) {
      setShow10(true)
      return
    }
    if (isNotValidEmail(kindleEmail)) {
      alert('Please enter a valid kindle email address')
      return
    }

    let num: string
    for (let objKey in booksObject.data) {
      if (booksObject.data[objKey].book === books[bookNum].book) {
        num = objKey
      }
    }

    if (userData.readBooks?.includes(num)) {
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

  const updateKindleEmailForAccountIfNeed = () => {
    if (kindleEmailFromFirestore !== kindleEmail) {
      try {
        const docRef = addDoc(collection(db, user?.sub), {
          kindleEmail: kindleEmail
        })
        fetchData()
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  }

  const setDownloadedBeforeIfNeed = () => {
    if (!userData.downloadedBefore) {
      try {
        const docRef = addDoc(collection(db, user?.sub), {
          downloadedBefore: true,
          userInfo: user
        })
        fetchData()
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }
  }

  // ====================== ACTUALLY DOWNLOAD BOOK =============================================
  const addBook = (bookNum: string) => {
    if (isNotValidEmail(kindleEmail)) {
      alert('Please enter a valid kindle email address')
      return
    }

    updateKindleEmailForAccountIfNeed()
    setDownloadedBeforeIfNeed()

    // ===== get correct book num from booksObject ==========
    let num: string
    for (let objKey in booksObject.data) {
      if (booksObject.data[objKey].book === books[currBookNumber].book) {
        num = objKey
        break
      }
    }
    // ======================================================

    const url = process.env.REQUEST_URL || 'http://localhost:3000'

    axios.get(`${url}/getBook/${num}/${kindleEmail}`).then((res) => {
      if (res.status === 200) {
        console.log('SUCCESS!', res.status, res.statusText)
        setShow6(false)
        setShow5(true)
        setTimeout(() => {
          setShow5(false)
        }, 1500)

        if (user?.sub) {
          try {
            const docRef = addDoc(collection(db, user?.sub), {
              bookRead: num
            })
            fetchData()
          } catch (e) {
            console.error('Error adding document: ', e)
          }
        }
      } else {
        setShow6(false)
        console.log('FAILED...')
      }
    })
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

  const handlePressNonFictionToggle = (switchValue) => {
    console.log('non Fiction Switch: ' + switchValue)
  }

  const handlePressFictionToggle = (switchValue) => {
    console.log('Fiction Switch: ' + switchValue)
  }

  // ================================= BOOK BUTTONS ===================================
  const bookButtons = Object.keys(books)
    .filter((key1) => {
      const allowedGenres = []
      if (switchState2) allowedGenres.push('fiction')
      if (switchState) allowedGenres.push('non-fiction')
      if (!books[key1]['genres']) return false
      for (let genre of books[key1]['genres']) {
        if (allowedGenres.includes(genre)) return true
      }
      return false
    })
    .map((key) => {
      let num
      let showFiction = switchState2
      let showNonFiction = switchState

      for (let objKey in booksObject.data) {
        if (booksObject.data[objKey].book === books[key].book) {
          num = objKey
          break
        }
      }

      let imageUrl = `http://s3.amazonaws.com/froobs-kindle-books/${num}.jpg`

      return (
        books[key]['book']
          .toLowerCase()
          .includes(bookSearchValue.toLowerCase()) && (
          <span
            style={{
              minWidth: '102px',
              height: '20vh',
              maxHeight: '150px',
              minHeight: '135px',
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: 'center center',
              backgroundRepeat: userData.readBooks?.includes(num)
                ? 'repeat'
                : 'no-repeat',
              backgroundSize: 'contain'
            }}
            key={key}
            className={`bookButton bookButton${num}`}
            variant={Number(key) % 2 == 0 ? 'outline-dark' : 'dark'}
            onClick={() => bookClickHandler(key)}
          >
            {userData.readBooks?.includes(num) && (
              <h4 className='ribbon'>Downloaded</h4>
            )}
          </span>
        )
      )
    })
  // ===================================================================================

  return (
    <React.Fragment>
      <div className='LibraryContainer'>
        <SideNav
          handlePressNonFictionToggle={handlePressNonFictionToggle}
          handlePressFictionToggle={handlePressFictionToggle}
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
            }.`}
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
            <Modal.Title>{`Download ${
              books[currBookNumber] !== undefined &&
              books[currBookNumber]['book']
            }?`}</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body className='descriptionBody'>
            {books[currBookNumber] !== undefined &&
              books[currBookNumber]['description']}
          </Modal.Body> */}
          <Modal.Footer>
            <Button variant='dark' onClick={handleDownloadBookOnModalClose}>
              Download book
            </Button>
            <Button variant='danger' onClick={handleClose3}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ========================================================================== */}

        <div className='libraryTitleContainer'>
          <div
            className='emailPicDiv'
            style={{
              backgroundImage: `url(${user?.picture})`,
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain'
            }}
          ></div>
          <h1>Library</h1>{' '}
          <Form className='searchBooksForm'>
            <Form.Group className='mb-0'>
              <Form.Control
                onClick={() => {
                  setSideNavStatus('sideNavClosed')
                }}
                type='text'
                value={bookSearchValue}
                onChange={(e: any) => handleSearchBooksChange(e)}
                placeholder='Search books'
              />
            </Form.Group>
          </Form>
          <i
            onClick={() => {
              setSideNavStatus(
                sideNavStatus === 'sideNavOpen'
                  ? 'sideNavClosed'
                  : 'sideNavOpen'
              )
            }}
            className='fa-solid fa-filter fa-2x'
          ></i>
        </div>

        <div className='kindleEmailFormContainer'>
          <Form className='kindleEmailAddressForm'>
            <div className='kindleEmailAddressFormInner'>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label className='kindleEmailAddressTitle'>
                  <span className='higherFontWeight '>
                    Kindle email address
                  </span>{' '}
                  {!isNotValidEmail(kindleEmail) && (
                    <i
                      className={`fa-solid fa-check ${'fa-circle-check2'}`}
                    ></i>
                  )}
                </Form.Label>{' '}
                <Form.Control
                  onClick={() => {
                    setSideNavStatus('sideNavClosed')
                  }}
                  className={kindleFormFieldClassName}
                  type='email'
                  placeholder='Enter email'
                  value={kindleEmail}
                  onChange={(e: any) => setKindleEmailAndSave(e)}
                />
              </Form.Group>
            </div>
          </Form>
        </div>

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
