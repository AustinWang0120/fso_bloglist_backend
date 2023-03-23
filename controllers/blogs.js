const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate({
    path: "user",
    select: "username name"
  })
  res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
  const body = req.body
  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author || "Anonymous",
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  // update randomUser's blogs
  console.log("randomUser type", user.constructor.name)
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()

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
  // only the creator can delete the blog
  const user = req.user

  const blog = await Blog.findById(req.params.id)
  if (!(blog.user.toString() === user.id.toString())) {
    return res.status(401).json({
      error: "only the creator can delete the blog"
    })
  }
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
