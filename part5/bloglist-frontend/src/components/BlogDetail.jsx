const BlogDetail = ({ blog, handleLikeClick }) => {
  const handleClick = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 }
    handleLikeClick(newBlog)
  }

  return (
    <div>
      <div>url: {blog.url}</div>
      <div>
        likes: {blog.likes}
        <button onClick={handleClick}>like</button>
      </div>
      <div>{blog.author}</div>
    </div>
  )
}

export default BlogDetail
