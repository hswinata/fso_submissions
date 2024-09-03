import { useState } from 'react'

const AddBlogForm = ({ handleAddBlog }) => {
  const [addFormData, setAddFormData] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setAddFormData({ ...addFormData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const tempId = Math.floor(100000 + Math.random() * 9000000)
    handleAddBlog(tempId, addFormData)
    setAddFormData({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input
            onChange={handleChange}
            name="title"
            type="text"
            value={addFormData.title}
          />
        </div>
        <div>
          Author
          <input
            onChange={handleChange}
            name="author"
            type="text"
            value={addFormData.author}
          />
        </div>
        <div>
          url
          <input
            onChange={handleChange}
            name="url"
            type="text"
            value={addFormData.url}
          />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

export default AddBlogForm
