import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return action.payload
    case 'REMOVE':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

//Provider component:
export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  //Helper function.
  const showNotification = (content, delay) => {
    notificationDispatch({ type: 'CREATE', payload: content })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, delay)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

//Custom hooks:
export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context.notification
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  return context.showNotification
}

export default NotificationContext
