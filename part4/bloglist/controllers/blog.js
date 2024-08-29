const blogRouter = require('express').Router()
const Blog = require('../models/blog')

//Routes.
blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json(deletedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true
      }
    )
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
