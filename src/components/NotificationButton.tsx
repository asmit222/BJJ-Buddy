import React from 'react'

function NotificationButton(): JSX.Element {
  const handleNotificationClick = (): void => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setTimeout(() => {
          new Notification('Hello, world!')
        }, 5000)
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(
          (permission: NotificationPermission) => {
            if (permission === 'granted') {
              setTimeout(() => {
                new Notification('Hello, world!')
              }, 5000)
            }
          }
        )
      }
    }
  }

  return <button onClick={handleNotificationClick}>Send Notification</button>
}

export default NotificationButton
