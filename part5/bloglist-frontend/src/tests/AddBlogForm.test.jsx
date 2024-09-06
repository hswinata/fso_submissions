import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from '../components/AddBlogForm'

test('', async () => {
  const mockAddBlogHandler = vi.fn()
  const user = userEvent.setup()

  render(<AddBlogForm handleAddBlog={mockAddBlogHandler} />)

  //Simulate filling in the form and sending it.
  const titleInput = screen.getByTestId('title-input')
  const authorInput = screen.getByTestId('author-input')
  const urlInput = screen.getByTestId('url-input')

  await user.type(titleInput, 'Blog component test')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'Test URL')

  const createButton = screen.getByRole('button', { name: 'create' })
  await user.click(createButton)

  //Check that there is one mock call.
  expect(mockAddBlogHandler.mock.calls).toHaveLength(1)

  //Check that the inputs are correct.
  expect(mockAddBlogHandler.mock.calls[0][0].title).toBe('Blog component test')
  expect(mockAddBlogHandler.mock.calls[0][0].author).toBe('Test Author')
  expect(mockAddBlogHandler.mock.calls[0][0].url).toBe('Test URL')
})
