import React, { useState, useEffect } from 'react'
import YouTube, { Options, OnReadyEvent } from 'react-youtube'

interface YouTubeVideoProps {
  id: string
  channel: string
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ id, channel }) => {
  const [videoTitle, setVideoTitle] = useState('')
  const [isLoading, setLoading] = useState(true)

  const opts: Options = {
    width: '100%',
    height: '300px',
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
    console.log('video Data: ' + JSON.stringify(player.getVideoData()))
    setVideoTitle(videoTitle)
    setLoading(false) // Set loading state to false when the video is ready
  }

  useEffect(() => {
    setVideoTitle('')
    setLoading(true) // Set loading state to true when the video ID changes
  }, [id])

  return (
    <React.Fragment>
      <div style={{ display: isLoading ? 'block' : 'none' }}>
        <i className='fas fa-spinner fa-spin fa-lg'></i>
      </div>
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        <YouTube videoId={id} opts={opts} onReady={onPlayerReady} />
        <h6 style={titleStyle}>{videoTitle}</h6>
        <h6 className='youtubeChannelName' style={titleStyle}>
          {channel}
        </h6>
      </div>
    </React.Fragment>
  )
}

export default YouTubeVideo
