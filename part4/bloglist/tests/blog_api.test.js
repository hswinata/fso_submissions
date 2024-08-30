const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const api = supertest(app)

describe('when some blogs are saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('fetching blogs', () => {
    test('blogs are returned in JSON format', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the amount of blogs returned is correct', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test(' `_id` is returned as `id`', async () => {
      const response = await api.get('/api/blogs')
      const returnedId = Object.keys(response.body[0]).find(
        (key) => key === 'id'
      )
      assert.strictEqual(returnedId, 'id')
    })
  })

  describe('when an authorized user exists', () => {
    let token
    beforeEach(async () => {
      await User.deleteMany({})
      //Create a user.
      const passwordHash = await bcryptjs.hash('root', 10)
      const rootUser = new User({
        username: 'root',
        passwordHash,
        name: 'root'
      })
      await rootUser.save()

      //JWT token.
      const username = rootUser.username
      const user = await User.findOne({ username })
      const userToken = { username: user.username, id: user._id }
      token = jwt.sign(userToken, process.env.SECRET)
    })

    describe('creation of blogs', () => {
      test('creates one blog', async () => {
        const newBlog = {
          title: 'Test Blog',
          author: 'Tony Test',
          url: 'https://tonytest.com/',
          likes: 666
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)

        const response = await api.get('/api/blogs')
        const blogsAfterPost = response.body
        assert.strictEqual(
          blogsAfterPost.length,
          helper.initialBlogs.length + 1
        )
      })

      test(' `likes` defaults to 0 if missing from the request', async () => {
        const newBlog = {
          title: 'Test Blog',
          author: 'Tony Test',
          url: 'https://tonytest.com/'
        }

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)

        const addedBlog = await api.get(`/api/blogs/${response.body.id}`)

        assert.deepStrictEqual(addedBlog.body.likes, 0)
      })

      test('server responds with 400 Bad Request if `title`` is missing from request', async () => {
        const newBlog = {
          author: 'Tony Test',
          url: 'https://tonytest.com/',
          likes: 666
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
      })

      test('server responds with 400 Bad Request if `url` is missing from request', async () => {
        const newBlog = {
          title: 'Test Blog',
          author: 'Tony Test',
          likes: 666
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
          .expect(400)
      })

      test('server responds with 401 Unauthorized if a token is missing', async () => {
        const newBlog = {
          title: 'Test Blog',
          author: 'Tony Test',
          url: 'https://tonytest.com/'
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', 'Bearer ')
          .expect(401)
      })
    })

    describe('when the user creates a blog', () => {
      let createdBlog
      beforeEach(async () => {
        //Create a blog
        const newBlog = {
          title: 'Test Blog',
          author: 'root',
          url: 'root',
          likes: 666
        }

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)

        createdBlog = response.body
      })

      describe('deletion of blog', async () => {
        test('deletes a blog', async () => {
          await api
            .delete(`/api/blogs/${createdBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

          const response = await api.get('/api/blogs')
          const blogsAfterDelete = response.body

          assert.strictEqual(
            blogsAfterDelete.length,
            helper.initialBlogs.length
          )

          const IDs = blogsAfterDelete.map((blog) => blog.id)
          assert(!IDs.includes(createdBlog.id))
        })
      })

      describe('update blog', async () => {
        test('updates a blog', async () => {
          const updatedBlog = {
            ...createdBlog,
            title: 'updated title',
            url: 'updated url'
          }

          await api
            .put(`/api/blogs/${createdBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)

          const response = await api.get(`/api/blogs/${createdBlog.id}`)
          const blogAfterUpdate = response.body

          assert.deepStrictEqual(blogAfterUpdate.title, 'updated title')
          assert.deepStrictEqual(blogAfterUpdate.url, 'updated url')
        })
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
