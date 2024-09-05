import PropTypes from 'prop-types'

const BlogDetail = ({ blog, handleLikeClick }) => {
  const handleClick = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    handleLikeClick(newBlog)
  }

  BlogDetail.propTypes = {
    blog: PropTypes.object.isRequired,
    handleLikeClick: PropTypes.func.isRequired
  }

  return (
    <div>
      <div>url: {blog.url}</div>
      <div>
        likes: {!blog.likes ? '0' : blog.likes}
        <button onClick={handleClick}>like</button>
      </div>
      <div>{blog.author}</div>
    </div>
  )
}

export default BlogDetail
