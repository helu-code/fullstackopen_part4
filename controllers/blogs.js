/* eslint-disable linebreak-style */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
console.log("Haetaan token")
  const token = getTokenFrom(request)
console.log("token haettu: ",token)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)


    const blog = new Blog({
      title: body.title,
      author : body.author,
      url : body.url,
      likes : body.likes,
      user: user._id
    })


    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

// blogsRouter.post('/', async (request, response,next) => {
//   console.log('BLOGGGG',request.body)
//   const body = request.body
//   const user = await User.findById(body.userId)
//  // const blog = new Blog(request.body)

//   const blog = new Blog({
//     title: body.title,
//     author : body.author,
//     url : body.url,
//     likes : body.likes,
//     user: user._id
//   })
//   try {
//     const savedBlog = await blog.save()
//     user.blogs = user.blogs.concat(savedBlog._id)
//     await user.save()
//     response.json(savedBlog.toJSON())
//   } catch (exception) {
//     next(exception)
//   }

//   // blog
//   //   .save()
//   //   .then(result => {
//   //     response.status(201).json(result)
//   //   })
// })

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    console.log('blogsRouter.delete',request.params )
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter