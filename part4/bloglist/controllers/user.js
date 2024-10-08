const bcryptjs = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      likes: 1
    })
    response.json(user)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/username/:username', async (request, response, next) => {
  try {
    const { username } = request.params
    const user = await User.findOne({ username }).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
      likes: 1
    })
    response.json(user)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  try {
    const { password } = request.body

    //Password validation
    if (password.length < 3)
      return response
        .status(400)
        .json({ error: 'Password has to be three characters or more' })

    //Hashing password.
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    //Saving new user.
    const user = new User({ ...request.body, passwordHash })
    const newUser = await user.save()

    response.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter
