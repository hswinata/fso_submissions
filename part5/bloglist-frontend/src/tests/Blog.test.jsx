import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'

test('Blog component renders title and author, but not url and likes', () => {
  //Simulate adding blog.
  const blog = {
    title: 'Blog component test',
    author: 'Test Author',
    url: 'Test URL',
    likes: 0
  }
  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      handleLikeClick={mockHandler}
      handleDeleteBlog={mockHandler}
    />
  )

  //Testing.
  const blogDiv = screen.getByTestId('blog')
  const blogDetailDiv = screen.getByTestId('blog-detail')

  // Check that the title and author are rendered.
  expect(blogDiv).toHaveTextContent('Blog component test by Test Author')

  //Check that URL and Likes are not visible.
  expect(screen.queryByText('Test URL')).toBeNull()
  expect(screen.queryByText('Likes: 0')).toBeNull()

  // Check that the blog detail div has display: none.
  expect(blogDetailDiv).toHaveStyle('display: none')
})
