import { useSelector, useDispatch } from 'react-redux'
import { removeNotification } from '../reducers/noficationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const notification = useSelector((state) => {
    return state.notification
  })

  setTimeout(() => {
    dispatch(removeNotification())
  }, 5000)

  return notification && <div style={style}>{notification}</div>
}

export default Notification
