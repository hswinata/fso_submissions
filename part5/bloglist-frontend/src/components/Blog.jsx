import BlogDetail from './BlogDetail'
import { useState } from 'react'

const Blog = ({ blog, handleLikeClick }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailVisible, setDetailVisible] = useState(false)

  const hideWhenDetailVisible = { display: detailVisible ? 'none' : '' }
  const showWhenDetailVisible = { display: detailVisible ? '' : 'none' }

  const toggleDetailVisibility = () => setDetailVisible(!detailVisible)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleDetailVisibility}>
          {detailVisible ? 'hide' : 'show'}
        </button>
      </div>
      <div style={showWhenDetailVisible}>
        <BlogDetail blog={blog} handleLikeClick={handleLikeClick} />
      </div>
    </div>
  )
}

export default Blog
