const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    //Validate user.
    const user = await User.findOne({ username })
    if (!user) {
      return response
        .status(401)
        .json({ error: 'invalid username or password' })
    }

    //Validate password.
    const passwordIsCorrect =
      user === null
        ? false
        : await bcryptjs.compare(password, user.passwordHash)
    if (!passwordIsCorrect)
      return response.status(401).json({ error: 'invalid password' })

    //Create jwt token.
    const loginUser = {
      username: user.username,
      id: user._id
    }
    const token = jwt.sign(loginUser, process.env.SECRET)

    response
      .status(200)
      .send({ username: user.username, name: user.name, token })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter
