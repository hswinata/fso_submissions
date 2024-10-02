import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      const userFilter = action.payload
      return userFilter
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
