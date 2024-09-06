import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('Blog component', () => {
  let blogDiv
  let blogDetailDiv
  let mockLikeHandler
  let mockDeleteHandler

  beforeEach(() => {
    //Simulate adding blog.
    const blog = {
      title: 'Blog component test',
      author: 'Test Author',
      url: 'Test URL',
      likes: 0
    }

    mockLikeHandler = vi.fn()
    mockDeleteHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        handleLikeClick={mockLikeHandler}
        handleDeleteBlog={mockDeleteHandler}
      />
    )

    blogDiv = screen.getByTestId('blog')
    blogDetailDiv = screen.getByTestId('blog-detail')
  })

  test('renders title and author, but url and likes are not visible', () => {
    // Check that the title and author are rendered.
    expect(blogDiv).toHaveTextContent('Blog component test by Test Author')

    //Check that URL and Likes are not visible.
    expect(screen.queryByText('Test URL')).toBeNull()
    expect(screen.queryByText('Likes: 0')).toBeNull()

    // Check that the blog detail div has display: none.
    expect(blogDetailDiv).toHaveStyle('display: none')
  })

  test('url and likes are visible when the "show" button is clicked', async () => {
    // Initially, the blog detail div should be hidden.
    expect(blogDetailDiv).toHaveStyle('display: none')

    //Simulate clicking 'show' button
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    //Check that URL and Likes are visible.
    expect(screen.getByText('url: Test URL')).toBeInTheDocument()
    expect(screen.getByText('likes: 0')).toBeInTheDocument()

    // Check that the blog detail div does not have 'display: none'.
    expect(blogDetailDiv).not.toHaveStyle('display: none')
  })

  test('mock event handler is called twice when "like" button is clicked twice', async () => {
    // Initially, the blog detail div should be hidden.
    expect(blogDetailDiv).toHaveStyle('display: none')

    //Simulate clicking 'show' button.
    const user = userEvent.setup()
    const showButton = screen.getByRole('button', { name: 'show' })
    await user.click(showButton)

    //Simulate clicking 'like' button twice.
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    //Check if likeButton is clicked twice.
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
