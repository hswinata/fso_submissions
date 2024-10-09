import axios from 'axios'

const baseUrl = 'http://localhost:3001'

const getAll = async () => {
  const response = axios.get(baseUrl)
  return response.data
}

export default { getAll }
