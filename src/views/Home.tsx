import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

const Home: React.FC = () => {
  const { user } = useAuth0()
  const { loginWithRedirect } = useAuth0()
  const { logout, isAuthenticated } = useAuth0()

  // ================ RUN ON PAGE LOAD ======================
  useEffect(() => {
    console.log('Home page loaded')
  }, [])
  // =========================================================

  const [bookRequestFormValue, setBookRequestFormValue] = useState('')
  const [show3, setShow3] = useState(false)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleClose3 = () => setShow3(false)
  const handleShow3 = () => {
    setShow3(true)
  }

  const handleBookRequestFormChange = (e) => {
    setBookRequestFormValue(e.target.value)
  }

  // ============================ REQUEST BOOK ====================================
  const requestBook = () => {
    let yourDate = new Date()
    let dateAsString = yourDate.toISOString().split('T')[0]
    let localStorageRequestCount = localStorage.getItem(dateAsString)
    if (localStorageRequestCount === null) {
      localStorage.setItem(dateAsString, '1')
    } else {
      if (Number(localStorageRequestCount) > 4) {
        alert('You can only request 5 books a day.')
        return
      }
      localStorage.setItem(
        dateAsString,
        JSON.stringify(Number(localStorageRequestCount) + 1)
      )
      console.log('current request count: ', localStorage.getItem(dateAsString))
    }

    if (bookRequestFormValue === '') {
      alert('Please enter a book title and author.')
      return
    }

    setShow(true)

    setTimeout(() => {
      setShow(false)
    }, 1500)

    const url = process.env.REQUEST_URL || 'http://localhost:3000'

    axios.get(`${url}/bookRequest/${bookRequestFormValue}`).then((res) => {
      console.log(res)
      if (res.status === 200) {
        setBookRequestFormValue('')
      } else {
        setBookRequestFormValue('')
        console.log('FAILED to request book...')
      }
    })
  }

  // ============================================================================

  return (
    <React.Fragment>
      <div className='HomeContainer'>
        <Modal centered show={show} onHide={handleClose} animation={true}>
          <Modal.Header closeButton>
            <Modal.Title>Request sent!</Modal.Title>
          </Modal.Header>
        </Modal>
        <div className='HomeTitleContainer'>
        <h1 className='stepsTitle'>Steps:</h1>{' '}
          </div>
        <p>
          <b className='directionNumber'>1)</b> Add{' '}
          <b>froobskindlebooks@gmail.com</b> to your kindle's{' '}
          <a
            target='_blank'
            href='https://www.amazon.com/gp/help/customer/display.html?nodeId=GX9XLEVV8G4DB28H'
          >
            Approved Personal Document E-mail List
          </a>
        </p>
        <p>
          <b className='directionNumber'>2)</b> Have your{' '}
          <a
            target='_blank'
            href='https://www.lifewire.com/find-kindle-email-address-5271915'
          >
            kindle's email address
          </a>{' '}
          ready
        </p>
        <p>
          <b className='directionNumber'>3)</b>{' '}
          <span
            className='loginButtonSpan'
            onClick={() => {
              if (!user?.sub) {
                loginWithRedirect()
              }
            }}
          >
            Login{' '}
          </span>{' '}
          with your email and navigate to the{' '}
          <Link to='/Library'>
            <b>Library</b>{' '}
          </Link>
          page, enter your kindle's email address at the bottom, and download
          some books!
        </p>
        <p>
          <b className='directionNumber'>4)</b> Press <b>"Sync"</b> in the drop
          down menu on your kindle to get the new books to show up (takes a min
          or two)
        </p>

        <div className='horizontalDivider'></div>
        <Form className='requestForm'>
          <Form.Group className='mb-0'>
            <div className='requestBookButtonContainer'>
              <Form.Label>
                <span className='higherFontWeight'>Request a book</span>
              </Form.Label>{' '}
              <Button
                onClick={requestBook}
                className='requestButton'
                variant='primary'
                size='sm'
              >
                Request
              </Button>
            </div>
            <Form.Control
              value={bookRequestFormValue}
              onChange={(e) => handleBookRequestFormChange(e)}
              type='text'
              placeholder='book title and author'
            />
            <Form.Text className='text-muted'>
              Come back in a day or two to see if your book has been added.
            </Form.Text>
          </Form.Group>
        </Form>
        <div className='horizontalDivider'></div>
        <Button
          className='donateButton'
          onClick={handleShow3}
          variant='warning'
          size='sm'
        >
          Donate with Bitcoin
        </Button>
        {isAuthenticated && (
          <Button
            onClick={() => {
              logout()
            }}
            className='logoutButtonNextToDonate'
            variant='danger'
            size='sm'
          >
            Logout
          </Button>
        )}

        <Modal fullscreen={true} centered show={show3} onHide={handleClose3}>
          <Modal.Body className='venmoModalBody'>
            <div className='venmoQRCodeContainer'></div>
            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  '341vkocGtDSeCrEdmTGnh4zqaqnQ3AM2Gk'
                )
              }}
              className='venMoNameDiv'
            >
              <b>341vkocGtDSeCrEdmTGnh4zqaqnQ3AM2Gk</b>
              <i className='fas fa-copy fa-lg'></i>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={handleClose3}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ==================================================================================== */}
      </div>
    </React.Fragment>
  )
}

export default Home
