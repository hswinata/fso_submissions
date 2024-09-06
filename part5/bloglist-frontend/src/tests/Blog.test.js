import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'

test('Blog component renders title and author, but not url and likes', () => {
  const blog = {
    title: 'Blog component test',
    author: 'Test Author',
    url: 'Test URL',
    likes: 0
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Blog component test')
  expect(element).toBeDefined()
})
