const Notification = ({ notificationMessage, notificationType }) => {
  if (notificationMessage === null) return null

  const notificationStyle = {
    color: notificationType === 'notification' ? 'green' : ' red',
    fontSize: 24,
    border: `3px solid ${notificationType === 'notification' ? 'green' : 'red'}`,
    padding: '5px',
    marginBottom: '5px'
  }

  return (
    <div
      className={notificationType === 'notification' ? 'notification' : 'error'}
      style={notificationStyle}
    >
      {notificationMessage}
    </div>
  )
}

export default Notification
