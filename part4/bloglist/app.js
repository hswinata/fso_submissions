const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

//Connecting to database.
mongoose.set('strictQuery', false)

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

//Middleware
app.use(middleware.tokenExtractor)
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
