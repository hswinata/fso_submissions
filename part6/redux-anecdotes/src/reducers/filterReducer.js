const filterReducer = (state = '', action) => {
  console.log('action:', action)

  switch (action.type) {
    case 'FILTER':
      return action.payload.filter
    default:
      return state
  }
}

//Action creator.
export const filterChange = (filter) => {
  return {
    type: 'FILTER',
    payload: { filter }
  }
}

export default filterReducer
