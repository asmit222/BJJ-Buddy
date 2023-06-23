import React, { useState, useEffect } from 'react'
import YouTube, { Options, OnReadyEvent } from 'react-youtube'

interface YouTubeVideoProps {
  id: string
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ id }) => {
  const [videoTitle, setVideoTitle] = useState('')

  const opts: Options = {
    width: '100%',
    playerVars: {
      // Add any additional player parameters here if needed
    }
  }

  const titleStyle: React.CSSProperties = {
    wordWrap: 'break-word'
  }

  const onPlayerReady = (event: OnReadyEvent) => {
    const player = event.target
    const videoTitle = player.getVideoData().title
    setVideoTitle(videoTitle)
  }

  useEffect(() => {
    setVideoTitle('')
  }, [id])

  return (
    <React.Fragment>
      <YouTube videoId={id} opts={opts} onReady={onPlayerReady} />
      <h6 style={titleStyle}>{videoTitle}</h6>
    </React.Fragment>
  )
}

export default YouTubeVideo
