import PropTypes from 'prop-types'

const BlogDetail = ({ blog, handleLikeClick }) => {
  const handleClick = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    handleLikeClick(newBlog)
  }

  return (
    <div>
      <div>url: {blog.url}</div>
      <span>likes: {!blog.likes ? '0' : blog.likes}</span>
      <div>
        <button onClick={handleClick}>like</button>
      </div>
      <div>{blog.author}</div>
    </div>
  )
}

BlogDetail.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikeClick: PropTypes.func.isRequired
}

export default BlogDetail
