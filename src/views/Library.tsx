import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

import { addDoc, collection, getDocs } from '@firebase/firestore'
import { db } from '../utils/firebaseConfig/firebase'
import SideNav from '../components/SideNav'
import LibraryTitle from '../components/LibraryTitle'
import DownloadModal from '../components/DownloadModal'

import YouTubeVideo from '../components/YouTubeVideo'

const Library: React.FC = () => {
  const { user } = useAuth0()
  const [userIdentifier, setUserIdentifier]: any = useState('')

  const [showKindleEmailForm, handleShowKindleEmailForm] = useState(false)

  useEffect(() => {
    if (user?.sub !== undefined) {
      setUserIdentifier(user?.sub)
      console.log('user: ' + user?.sub)
    }
  }, [user])

  const [bookSearchValue, setBookSearchValue] = useState('')
  const [sideNavStatus, setSideNavStatus] = useState<string>('sideNavClosed')
  const [switchState, setSwitchState] = useState(true)
  const [switchState2, setSwitchState2] = useState(true)
  const [switchState3, setSwitchState3] = useState(true)
  const [switchState4, setSwitchState4] = useState(true)
  const [switchState5, setSwitchState5] = useState(true)

  const [sweepsOpen, setSweepsOpen] = useState(false)
  const [mountEscapesOpen, setMountEscapesOpen] = useState(false)

  const clearSearchBox = () => {
    setBookSearchValue('')
  }

  const handleSearchBooksChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setBookSearchValue(e.target.value)
  }

  const sweepVideos = [
    'qp5AXBHxQec',
    'F0Qz-DcqxJw',
    '6oo323AQ0JI',
    'KXCdU94TRic'
  ]
  const mountEscapeVideos = ['pw_9ZZLkkNI']

  const containerStyle: React.CSSProperties = {
    height: '100%'
  }

  return (
    <React.Fragment>
      <div
        className={
          showKindleEmailForm ? 'LibraryContainer2' : 'LibraryContainer'
        }
      >
        <SideNav
          sideNavStatus={sideNavStatus}
          switchState={switchState}
          setSwitchState={setSwitchState}
          switchState2={switchState2}
          setSwitchState2={setSwitchState2}
          switchState3={switchState3}
          setSwitchState3={setSwitchState3}
          switchState4={switchState4}
          setSwitchState4={setSwitchState4}
          switchState5={switchState5}
          setSwitchState5={setSwitchState5}
        />

        {/* ========================== DOWNLOADING AND SUCCESS MODALS =============================== */}
        <LibraryTitle
          clearSearchBox={clearSearchBox}
          user={user}
          bookSearchValue={bookSearchValue}
          handleSearchBooksChange={handleSearchBooksChange}
          setSideNavStatus={setSideNavStatus}
          sideNavStatus={sideNavStatus}
        />

        <div
          onClick={() => {
            setSideNavStatus('sideNavClosed')
          }}
          className='bookButtonsContainer'
        >
          <div
            onClick={() => setSweepsOpen(!sweepsOpen)}
            className={
              sweepsOpen ? 'toReadOuterContainer' : 'toReadOuterContainer2'
            }
          >
            <span className='dropDownTitle'>Sweeps</span>
            <i className='fa-solid fa-chevron-down fa-lg'></i>
            {sweepsOpen && (
              <div className='toReadContainer'>
                {sweepVideos.map((id, i) => {
                  return (
                    <div
                      className={
                        i !== 0
                          ? 'youtubeVideoContainer'
                          : 'youtubeVideoContainer2'
                      }
                      style={containerStyle}
                    >
                      <YouTubeVideo id={id} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div
            onClick={() => setMountEscapesOpen(!mountEscapesOpen)}
            className={
              mountEscapesOpen
                ? 'toReadOuterContainer'
                : 'toReadOuterContainer2'
            }
          >
            <span className='dropDownTitle'>Mount Escapes</span>
            <i className='fa-solid fa-chevron-down fa-lg'></i>
            {mountEscapesOpen && (
              <div className='toReadContainer'>
                {mountEscapeVideos.map((id, i) => {
                  return (
                    <div
                      className={
                        i !== 0
                          ? 'youtubeVideoContainer'
                          : 'youtubeVideoContainer2'
                      }
                      style={containerStyle}
                    >
                      <YouTubeVideo id={id} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Library
