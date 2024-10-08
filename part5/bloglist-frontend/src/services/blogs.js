import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addBlog = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLike = async (updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config
  )
  return response.data
}

const deleteBlog = async (deletedBlogId) => {
  const config = { headers: { authorization: token } }
  const response = await axios.delete(`${baseUrl}/${deletedBlogId}`, config)
  return response.data
}

export default { getAll, addBlog, addLike, deleteBlog, setToken }
