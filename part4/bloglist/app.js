const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

//Connecting to database.
mongoose.set('strictQuery', false)

mongoose
  .connect(config.mongoUrl)
  .then((result) => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

//Middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
