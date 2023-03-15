import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import booksObject from '../utils/books.js'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import LogoutButton from '../components/LogoutButton'

const Account: React.FC = (props) => {
  useEffect(() => {
    console.log(props.user)
  }, [])

  const [books, setBooks] = useState(booksObject.data)
  const [data, setData] = useState<any[]>([])
  const [userData, setUserData] = useState<{ [key: string]: any }>({})
  const [user, setUser] = useState(props.user)

  const [toReadOpen, setToReadOpen] = useState(false)
  const [downloadedOpen, setDownloadedOpen] = useState(false)
  const [readOpen, setReadOpen] = useState(false)

  const processData = () => {
    const tempUserData = {
      readBooks: [],
      readingListBooks: [],
      shelfReadBooks: []
    }
    let mostRecentTime = 0

    data.forEach((dataItem) => {
      if (dataItem.bookRead) tempUserData.readBooks.push(dataItem.bookRead)
      if (dataItem.readingListBook)
        tempUserData.readingListBooks.push(dataItem.readingListBook)
      if (dataItem.readBook) tempUserData.shelfReadBooks.push(dataItem.readBook)
      if (
        dataItem.kindleEmail &&
        dataItem.timeAdded &&
        Number(dataItem.timeAdded) > mostRecentTime
      ) {
        mostRecentTime = Number(dataItem.timeAdded)
        tempUserData.kindleEmail = dataItem.kindleEmail
      }
      if (dataItem.downloadedBefore !== undefined)
        tempUserData.downloadedBefore = dataItem.downloadedBefore
    })

    setUserData(tempUserData)
  }

  const fetchData = async (forceUpdate = false) => {
    let newData = []
    const cacheKey = `userData_${user?.sub}`

    // Check if data is in cache
    const cachedData = window.sessionStorage.getItem(cacheKey)
    if (cachedData && !forceUpdate) {
      console.log('Using Cached data')
      newData = JSON.parse(cachedData)
      setData(newData)
      return
    }

    console.log('Not Using Cached data')

    try {
      const querySnapshot = await getDocs(collection(db, user?.sub))
      newData = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
      setData(newData)

      // Store data in cache
      window.sessionStorage.setItem(cacheKey, JSON.stringify(newData))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log('user: ' + user?.sub)
    console.log(user?.name)
    if (user?.sub !== undefined) {
      fetchData()
    }
  }, [user])

  useEffect(() => {
    if (data.length) {
      processData()
    }
  }, [data])

  useEffect(() => {
    if (Object.keys(userData).length !== 0) {
      console.log('userData: ' + JSON.stringify(userData))
    }
  }, [userData])

  const toReadBookButtons = Object.keys(books)
    .filter((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )
      return userData.readingListBooks?.includes(Number(num))
    })
    .map((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )

      const imageUrl = `http://s3.amazonaws.com/froobs-kindle-books/${num}.jpg`
      return (
        <div
          key={key}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            minHeight: '150px',
            minWidth: '100px'
          }}
          className={`bookButtonAccountPage`}
        ></div>
      )
    })

  const readBooksBookButtons = Object.keys(books)
    .filter((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )
      return userData.readBooks?.includes(num)
    })
    .map((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )

      const imageUrl = `http://s3.amazonaws.com/froobs-kindle-books/${num}.jpg`
      return (
        <div
          key={key}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            minHeight: '150px',
            minWidth: '100px'
          }}
          className={`bookButtonAccountPage`}
        ></div>
      )
    })

  const readBookButtons = Object.keys(books)
    .filter((key) =>
      userData.shelfReadBooks?.includes(
        Number(
          Object.keys(booksObject.data).find(
            (objKey) => booksObject.data[objKey].book === books[key].book
          )
        )
      )
    )
    .map((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )
      return (
        <div
          key={key}
          style={{
            backgroundImage: `url(http://s3.amazonaws.com/froobs-kindle-books/${num}.jpg)`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            minHeight: '150px',
            minWidth: '100px'
          }}
          className='bookButtonAccountPage'
        ></div>
      )
    })

  const renderShelf = (isOpen, toggleOpen, shelfTitle, books, buttons) => {
    const hasBooks = books?.length > 0

    return (
      <>
        {isOpen ? (
          <div
            onClick={() => toggleOpen(false)}
            className='toReadOuterContainer'
          >
            <h5 className='to-read-h5'>{`${shelfTitle} (${
              [...new Set(books)].length || 0
            })`}</h5>
            <i className='fa-solid fa-chevron-up'></i>
            <div className='toReadContainer'>
              {hasBooks ? (
                buttons
              ) : (
                <span>{`Your ${shelfTitle} book shelf is empty.`}</span>
              )}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => toggleOpen(true)}
            className='toReadOuterContainer2'
          >
            <h5 className='to-read-h5'>{`${shelfTitle} (${
              [...new Set(books)].length || 0
            })`}</h5>
            <i className='fa-solid fa-chevron-down'></i>
            <div className='toReadContainer2'>
              {hasBooks ? (
                buttons
              ) : (
                <span>{`Your ${shelfTitle} book shelf is empty.`}</span>
              )}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <React.Fragment>
      <div className='AccountTitleContainer'>
        <img
          src={
            props.user?.picture ||
            'https://i.pinimg.com/originals/71/f3/51/71f3519243d136361d81df71724c60a0.png'
          }
          className='userIcon'
        ></img>
      </div>
      <div className='AccountContainer'>
        <div className='shelvesTitleContainer'>
          <h1>Bookshelves</h1>
        </div>
        {renderShelf(
          readOpen,
          setReadOpen,
          'Read',
          userData.shelfReadBooks,
          readBookButtons
        )}
        {renderShelf(
          toReadOpen,
          setToReadOpen,
          'To-Read',
          userData.readingListBooks,
          toReadBookButtons
        )}
        {renderShelf(
          downloadedOpen,
          setDownloadedOpen,
          'Downloaded',
          userData.readBooks,
          readBooksBookButtons
        )}
        <div className='logoutButtonContainer'>
          <LogoutButton />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Account
