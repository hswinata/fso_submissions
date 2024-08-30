const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

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

  describe('creation of blogs', () => {
    test('creates one blog', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Tony Test',
        url: 'https://tonytest.com/',
        likes: 666
      }

      await api.post('/api/blogs').send(newBlog).expect(201)

      const response = await api.get('/api/blogs')
      const blogsAfterPost = response.body
      assert.strictEqual(blogsAfterPost.length, helper.initialBlogs.length + 1)
    })

    test(' `likes` defaults to 0 if missing from the request', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Tony Test',
        url: 'https://tonytest.com/'
      }

      const response = await api.post('/api/blogs').send(newBlog)
      const addedBlog = await api.get(`/api/blogs/${response.body.id}`)

      assert.deepStrictEqual(addedBlog.body.likes, 0)
    })

    test('server responds with 400 Bad Request if `title`` is missing from request', async () => {
      const newBlog = {
        author: 'Tony Test',
        url: 'https://tonytest.com/',
        likes: 666
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('server responds with 400 Bad Request if `url` is missing from request', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Tony Test',
        likes: 666
      }

      await api.post('/api/blogs').send(newBlog).expect(400)
    })
  })

  describe('deletion of blog', async () => {
    test('deletes a blog', async () => {
      const blogToDelete = helper.initialBlogs[0]
      await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204)

      const response = await api.get('/api/blogs')
      const blogsAfterDelete = response.body

      assert.strictEqual(
        blogsAfterDelete.length,
        helper.initialBlogs.length - 1
      )

      const IDs = blogsAfterDelete.map((blog) => blog.id)
      assert(!IDs.includes(blogToDelete._id))
    })
  })

  describe('update blog', async () => {
    test('updates a blog', async () => {
      const blogToUpdate = helper.initialBlogs[0]

      const updatedBlog = {
        ...blogToUpdate,
        title: 'updated title',
        url: 'updated url'
      }

      await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(updatedBlog)
        .expect(200)

      const response = await api.get(`/api/blogs/${blogToUpdate._id}`)
      const blogAfterUpdate = response.body

      assert.deepStrictEqual(blogAfterUpdate.title, 'updated title')
      assert.deepStrictEqual(blogAfterUpdate.url, 'updated url')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
