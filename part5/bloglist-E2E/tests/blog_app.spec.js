const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the test database.
    await request.post('/api/testing/reset')

    //Add a new user.
    await request.post('/api/users', {
      data: {
        name: 'testuser',
        username: 'testuser',
        password: 'testuser'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const headerText = await page.getByText('log in to application')
    await expect(headerText).toBeVisible()

    const username = await page.getByText('username')
    await expect(username).toBeVisible()

    const password = await page.getByText('password')
    await expect(password).toBeVisible()
  })

  describe('Login', () => {
    test('Login succeeds with correct credentials', async ({ page }) => {
      await login(page, 'testuser', 'testuser')
      const notifDiv = await page.locator('.notification')
      await expect(notifDiv).toContainText('testuser has succesfully logged in')
    })

    test('Login fails with wrong credentials', async ({ page }) => {
      await login(page, 'wronguser', 'wrongpassword')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
    })
  })

  describe('When user is logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'testuser', 'testuser')
    })

    test('User can create a blog', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')

      const notifDiv = await page.locator('.notification')
      await expect(notifDiv).toContainText(
        'a new blog test title has been added'
      )

      const newBlog = await page.getByText('test title by test author')
      await expect(newBlog).toBeVisible()
    })

    describe('When a user has created one blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title', 'test author', 'test url')
      })

      test('User can like a blog', async ({ page }) => {
        await expect(page.getByText('test title by test author')).toBeVisible()

        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        const like = await page.getByText('likes: 1')
        await expect(like).toBeVisible()
      })
    })
  })
})
