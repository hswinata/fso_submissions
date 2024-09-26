import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = ({ target }) => {
    dispatch(filterChange(target.value))
  }

  const style = {
    marginBottom: '10px'
  }

  return (
    <div style={style}>
      Filter: <input name="filter" onChange={handleChange} />
    </div>
  )
}

export default Filter
