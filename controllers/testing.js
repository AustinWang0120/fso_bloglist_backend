const testingRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

testingRouter.get("/", (req, res) => {
  res.send("<h1>you are in the testing mode</h1>")
})

testingRouter.post("/reset", async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

module.exports = testingRouter
