const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  //Removes the word 'Bearer' and returns only the token.
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const username = jwt.verify(request.token, process.env.SECRET).username
  request.user = await User.findOne({ username })
  next()
}

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })

  if (error.name === 'ValidationError') return response.status(400).json(error)

  if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'invalid token' })

  if (error.name === 'ForbiddenUser')
    return response
      .status(403)
      .json({ error: 'you are not allowed to delete this blog' })

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
