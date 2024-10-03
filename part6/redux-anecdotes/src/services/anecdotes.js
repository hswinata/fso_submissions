import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (content) => {
  const getId = () => (100000 * Math.random()).toFixed(0)
  const newObject = { content, id: getId(), votes: 0 }
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const vote = async (id, object) => {
  const votedObject = { ...object, votes: object.votes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, votedObject, {
    new: true
  })
  return response.data
}

export default { getAll, create, vote }
