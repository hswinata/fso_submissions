import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    createNotification(state, action) {
      const notificationMessage = action.payload
      return notificationMessage
    },
    removeNotification() {
      return null
    }
  }
})

export const { createNotification, removeNotification } =
  notificationSlice.actions

export const setNotification = (notification, delayInSeconds) => {
  return async (dispatch) => {
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification())
    }, delayInSeconds * 1000)
  }
}
export default notificationSlice.reducer
