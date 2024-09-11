const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog, clickButton } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the test database.
    await request.post('/api/testing/reset')

    // Add a new user.
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
        await clickButton(page, 'show')
        await clickButton(page, 'like')
        const like = await page.getByText('likes: 1')
        await expect(like).toBeVisible()
      })
    })

    describe('When two users have both created one blog each', () => {
      beforeEach(async ({ page, request }) => {
        //First user creates a blog.
        await createBlog(page, 'test title', 'test author', 'test url')
        await expect(page.getByText('test title by test author')).toBeVisible()

        //First user logs out.
        await clickButton(page, 'logout')

        //Creation of user2.
        await request.post('/api/users', {
          data: {
            name: 'testuser2',
            username: 'testuser2',
            password: 'testuser2'
          }
        })

        //user2 logs in and creates a blog.
        await login(page, 'testuser2', 'testuser2')
        await expect(
          page.getByText('testuser2 has succesfully logged in')
        ).toBeVisible()
        await createBlog(page, 'test title2', 'test author2', 'test url2')
        await expect(
          page.getByText('test title2 by test author2')
        ).toBeVisible()
      })

      test('Only the user who created the blog can delete it', async ({
        page
      }) => {
        //user2 selects the blog they created and clicks show.
        const secondBlogElement = await page
          .locator('.blog-list-container > .blog-container')
          .nth(1)
        await clickButton(secondBlogElement, 'show')

        // Set up the dialog handler before clicking "remove"
        await page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        //user2 clicks on remove.
        await clickButton(secondBlogElement, 'remove')

        await expect(page.getByText('Blog has been deleted')).toBeVisible()
        await expect(
          page.getByText('test title2 by test author2')
        ).not.toBeVisible()
      })
    })

    describe('When there are multiple blogs', () => {
      let blogsContainer
      beforeEach(async ({ page }) => {
        //User creates 3 blogs
        await createBlog(page, 'test title1', 'test author1', 'test url1')
        await createBlog(page, 'test title2', 'test author2', 'test url2')
        await createBlog(page, 'test title3', 'test author3', 'test url3')

        //Check that the order is correct.
        blogsContainer = await page.locator('.blog-list-container')
        const allBlogContents = await blogsContainer
          .locator('.blog-container .blog-title')
          .allTextContents()

        const expectedOrder = [
          'test title1 by test author1',
          'test title2 by test author2',
          'test title3 by test author3'
        ]
        await expect(allBlogContents).toStrictEqual(expectedOrder)
      })

      test('Blogs are sorted in descending order by likes', async ({
        page
      }) => {
        //User likes second blog twice.
        const secondBlogElement = await blogsContainer
          .getByText('test title2 by test author2')
          .locator('../..')

        await clickButton(secondBlogElement, 'show')
        await clickButton(secondBlogElement, 'like')
        await page.waitForTimeout(1000)
        await clickButton(secondBlogElement, 'like')
        await expect(secondBlogElement.getByText('likes: 2')).toBeVisible()

        // User likes third blog once.
        const thirdBlogElement = await blogsContainer
          .getByText('test title3 by test author3')
          .locator('../..')
        await clickButton(thirdBlogElement, 'show')
        await clickButton(thirdBlogElement, 'like')
        await expect(thirdBlogElement.getByText('Likes: 1')).toBeVisible()

        //Check that the order is correct.
        const allBlogContents = await blogsContainer
          .locator('.blog-container .blog-title')
          .allTextContents()

        const expectedOrder = [
          'test title2 by test author2',
          'test title3 by test author3',
          'test title1 by test author1'
        ]

        await expect(allBlogContents).toStrictEqual(expectedOrder)
      })
    })
  })
})
