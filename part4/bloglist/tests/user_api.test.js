const { test, describe, after, beforeEach } = require('node:test')
const User = require('../models/user')
const helper = require('./test_helper')

const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcryptjs = require('bcryptjs')

const api = supertest(app)

describe('when root user is initially saved', () => {
  beforeEach(async () => {
    await User.deleteMany()
    const passwordHash = await bcryptjs.hash('root', 10)
    const rootUser = new User({ username: 'root', passwordHash, name: 'root' })
    await rootUser.save()
  })

  describe('fetching users', () => {
    test('users are returned in JSON format', async () => {
      api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('the amount of returned users is correct', async () => {
      const response = await api.get('/api/users')
      const usersAfterFetch = response.body
      assert.strictEqual(usersAfterFetch.length, 1)
    })
  })

  describe('creation of users', () => {
    test('creates a user', async () => {
      const newUser = {
        username: 'test',
        password: 'test',
        name: 'test'
      }

      await api.post('/api/users').send(newUser).expect(201)

      const response = await api.get('/api/users')
      const usersAfterPost = response.body
      assert.strictEqual(usersAfterPost.length, 2)

      const usernames = usersAfterPost.map((user) => user.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails if username is less than 3 characters', async () => {
      const newUser = {
        username: 'te',
        password: 'test',
        name: 'test'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const response = await api.get('/api/users')
      const usersAfterPost = response.body
      const addedUser = usersAfterPost.find((user) => user.username === 'te')
      assert.strictEqual(addedUser, undefined)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
