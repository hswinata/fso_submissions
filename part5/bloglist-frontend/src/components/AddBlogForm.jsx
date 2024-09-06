import { useState } from 'react'
import PropTypes from 'prop-types'

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
    handleAddBlog(addFormData)
    setAddFormData({ title: '', author: '', url: '' })
  }

  return (
    <div data-testid="addForm">
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input
            onChange={handleChange}
            name="title"
            type="text"
            value={addFormData.title}
            data-testid="title-input"
          />
        </div>
        <div>
          Author
          <input
            onChange={handleChange}
            name="author"
            type="text"
            value={addFormData.author}
            data-testid="author-input"
          />
        </div>
        <div>
          url
          <input
            onChange={handleChange}
            name="url"
            type="text"
            value={addFormData.url}
            data-testid="url-input"
          />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  handleAddBlog: PropTypes.func.isRequired
}

export default AddBlogForm
