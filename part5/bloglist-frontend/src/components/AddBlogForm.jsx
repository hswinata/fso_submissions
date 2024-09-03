import { useState } from 'react'

const AddBlogForm = ({ handleAddBlog }) => {
  const [formData, setFormData] = useState({ title: '', author: '', url: '' })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    const tempId = Math.floor(100000 + Math.random() * 9000000)
    handleAddBlog(event, tempId, formData)
    setFormData({ title: '', author: '', url: '' })
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title
          <input
            onChange={handleChange}
            name="title"
            type="text"
            value={formData.title}
          />
        </div>
        <div>
          Author
          <input
            onChange={handleChange}
            name="author"
            type="text"
            value={formData.author}
          />
        </div>
        <div>
          url
          <input
            onChange={handleChange}
            name="url"
            type="text"
            value={formData.url}
          />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </>
  )
}

export default AddBlogForm
