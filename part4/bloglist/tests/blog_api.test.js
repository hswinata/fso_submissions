const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('blogs are returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the amount of blogs returned are correct', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)
})

test(' `_id` is returned as `id`', async () => {
  const response = await api.get('/api/blogs')
  const returnedId = Object.keys(response.body[0]).find((key) => key === 'id')
  assert.strictEqual(returnedId, 'id')
})

after(async () => {
  await mongoose.connection.close()
})
