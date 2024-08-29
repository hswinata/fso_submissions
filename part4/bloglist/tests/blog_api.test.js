const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the amount of blogs returned are correct', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test(' `_id` is returned as `id`', async () => {
  const response = await api.get('/api/blogs')
  const returnedId = Object.keys(response.body[0]).find((key) => key === 'id')
  assert.strictEqual(returnedId, 'id')
})

test('creates a new blog post', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Tony Test',
    url: 'https://tonytest.com/',
    likes: 666
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogsAfterPost = await api.get('/api/blogs')
  assert.strictEqual(blogsAfterPost.body.length, initialBlogs.length + 1)
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

test(`server responds with 400 Bad Request if 'title' is missing from request`, async () => {
  const newBlog = {
    author: 'Tony Test',
    url: 'https://tonytest.com/',
    likes: 666
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test(`server responds with 400 Bad Request if 'url' is missing from request`, async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Tony Test',
    likes: 666
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('deletes a blog', async () => {
  const id = initialBlogs[0]._id
  await api.delete(`/api/blogs/${id}`).expect(204)

  const blogsAfterDelete = await api.get('/api/blogs')
  assert.strictEqual(blogsAfterDelete.body.length, initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
