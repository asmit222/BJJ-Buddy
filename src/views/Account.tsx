import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import booksObject from '../utils/books.js'
import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'

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
          // onClick={() => bookClickHandler(key)}
        >
          {/* {userData.readingListBooks?.includes(Number(num)) &&
          !userData.readBooks?.includes(num) && (
            <h4 className='ribbon2'>to-read</h4>
          )}
        {userData.readBooks?.includes(num) && (
          <h4 className='ribbon'>Downloaded</h4>
        )} */}
        </div>
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
          // onClick={() => bookClickHandler(key)}
        >
          {/* {userData.readingListBooks?.includes(Number(num)) &&
          !userData.readBooks?.includes(num) && (
            <h4 className='ribbon2'>to-read</h4>
          )}
        {userData.readBooks?.includes(num) && (
          <h4 className='ribbon'>Downloaded</h4>
        )} */}
        </div>
      )
    })

  const readBookButtons = Object.keys(books)
    .filter((key) => {
      const num = Object.keys(booksObject.data).find(
        (objKey) => booksObject.data[objKey].book === books[key].book
      )
      if (userData.shelfReadBooks?.includes(num)) {
        console.log(userData.shelfReadBooks, num)
      }
      return userData.shelfReadBooks?.includes(Number(num))
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
          // onClick={() => bookClickHandler(key)}
        >
          {/* {userData.readingListBooks?.includes(Number(num)) &&
        !userData.readBooks?.includes(num) && (
          <h4 className='ribbon2'>to-read</h4>
        )}
      {userData.readBooks?.includes(num) && (
        <h4 className='ribbon'>Downloaded</h4>
      )} */}
        </div>
      )
    })

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
        {readOpen && (
          <div
            onClick={() => {
              setReadOpen(!readOpen)
            }}
            className='toReadOuterContainer'
          >
            <h5 className='to-read-h5'>Read</h5>
            <i className='fa-solid fa-chevron-up'></i>
            <div className='toReadContainer'>
              {userData.shelfReadBooks?.length > 0 ? (
                readBookButtons
              ) : (
                <span>Your Read book shelf is empty.</span>
              )}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
        {!readOpen && (
          <div
            onClick={() => {
              setReadOpen(!readOpen)
            }}
            className='toReadOuterContainer2'
          >
            <h5 className='to-read-h5'>Read</h5>{' '}
            <i className='fa-solid fa-chevron-down'></i>
            <div className='toReadContainer2'>
              {readBookButtons}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
        {toReadOpen && (
          <div
            onClick={() => {
              setToReadOpen(!toReadOpen)
            }}
            className='toReadOuterContainer'
          >
            <h5 className='to-read-h5'>To-Read</h5>
            <i className='fa-solid fa-chevron-up'></i>
            <div className='toReadContainer'>
              {userData.readingListBooks?.length > 0 ? (
                toReadBookButtons
              ) : (
                <span>Your To-Read book shelf is empty.</span>
              )}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
        {!toReadOpen && (
          <div
            onClick={() => {
              setToReadOpen(!toReadOpen)
            }}
            className='toReadOuterContainer2'
          >
            <h5 className='to-read-h5'>To-Read</h5>
            <i className='fa-solid fa-chevron-down'></i>
            <div className='toReadContainer2'>
              {toReadBookButtons}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}

        {downloadedOpen && (
          <div
            onClick={() => {
              setDownloadedOpen(!downloadedOpen)
            }}
            className='toReadOuterContainer'
          >
            <h5 className='to-read-h5'>Downloaded</h5>
            <i className='fa-solid fa-chevron-up'></i>
            <div className='toReadContainer'>
              {userData.readBooks?.length > 0 ? (
                readBooksBookButtons
              ) : (
                <span>Your Downloaded book shelf is empty.</span>
              )}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
        {!downloadedOpen && (
          <div
            onClick={() => {
              setDownloadedOpen(!downloadedOpen)
            }}
            className='toReadOuterContainer2'
          >
            <h5 className='to-read-h5'>Downloaded</h5>{' '}
            <i className='fa-solid fa-chevron-down'></i>
            <div className='toReadContainer2'>
              {readBooksBookButtons}
              <div className='bookButtonAccountPage'></div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default Account
