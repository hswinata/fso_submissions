const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', {
      username: 1,
      name: 1
    })
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      //Find logged in user.
      const user = request.user

      const blog = new Blog({ ...request.body, user: user.id })
      const newBlog = await blog.save()

      //Add blog to user collection.
      user.blogs = user.blogs.concat(newBlog._id)
      await user.save()

      response.status(201).json(newBlog)
    } catch (error) {
      next(error)
    }
  }
)

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      //Find logged in user.
      const user = request.user

      const blog = await Blog.findById(request.params.id).populate('user', {
        name: 1,
        username: 1,
        id: 1
      })

      //Return error if wrong logged in user tries to delete.
      if (blog.user[0].id !== user.id) {
        const error = new Error()
        error.name = 'ForbiddenUser'
        throw error
      }

      const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
      response.status(204).json(deletedBlog)
    } catch (error) {
      next(error)
    }
  }
)

blogRouter.put(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const { title, author, url, likes } = request.body
      const user = request.user
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        {
          new: true
        }
      ).populate('user', {
        name: 1,
        username: 1,
        id: 1
      })

      //Return error if wrong logged in user tries to put request.
      if (updatedBlog.user[0].id !== user.id) {
        const error = new Error()
        error.name = 'ForbiddenUser'
        throw error
      }

      response.status(200).json(updatedBlog)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = blogRouter
