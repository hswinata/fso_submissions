const bcryptjs = require('bcryptjs')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  try {
    //Hashing password.
    const { password } = request.body
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
