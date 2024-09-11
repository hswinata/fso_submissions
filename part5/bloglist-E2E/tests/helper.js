const clickButton = async (element, buttonName) => {
  await element.getByRole('button', { name: buttonName }).click()
}

const login = async (page, username, password) => {
  await page.getByTestId('username-input').fill(username)
  await page.getByTestId('password-input').fill(password)
  await clickButton(page, 'login')
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await clickButton(page, 'create')

  await page.getByText(`${title} by ${author}`).waitFor()
}

export { login, createBlog, clickButton }
