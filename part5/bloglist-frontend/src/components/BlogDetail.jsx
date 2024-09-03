const BlogDetail = ({ blog }) => (
  <div>
    <div>url: {blog.url}</div>
    <div>
      likes: {blog.likes}
      <button>like</button>
    </div>
    <div>{blog.author}</div>
  </div>
)

export default BlogDetail
