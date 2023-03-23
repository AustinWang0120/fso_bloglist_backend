const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate({
    path: "user",
    select: "username name"
  })
  res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
  const body = req.body

  // find a random user to be its creator
  const randomUser = await User.findOne().skip(Math.floor(Math.random() * await User.countDocuments()))
  console.log("random user", randomUser)
  console.log("random user id type", typeof randomUser._id)

  const blog = new Blog({
    title: body.title,
    author: body.author || "Anonymous",
    url: body.url,
    likes: body.likes || 0,
    user: randomUser._id
  })

  const savedBlog = await blog.save()

  // update randomUser's blogs
  console.log("randomUser type", randomUser.constructor.name)
  randomUser.blogs = randomUser.blogs.concat(savedBlog)
  await randomUser.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author || "Anonymous",
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, runValidators: true, context: "query" })
  res.json(updatedBlog)
})

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
