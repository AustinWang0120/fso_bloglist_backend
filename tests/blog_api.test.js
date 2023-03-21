const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

const initialBlogs = [
  {
    title: "First blog",
    author: "Austin Wang",
    url: "https://404.com",
    likes: 37
  },
  {
    title: "Second blog",
    author: "Austin Wang",
    url: "https://404.com",
    likes: 20
  },
  {
    title: "Third blog",
    author: "Austin Wang",
    url: "https://404.com",
    likes: 5
  }
]

// initialize the database
beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map((blog) => (new Blog(blog)))
  const promiseArray = blogObjects.map((blog) => (blog.save()))
  await Promise.all(promiseArray)
})

test("able to return correct amount of blogs", async () => {
  const res = await api.get("/api/blogs")
  expect(res.body).toHaveLength(initialBlogs.length)
})

afterAll(async() => {
  await mongoose.connection.close()
})
