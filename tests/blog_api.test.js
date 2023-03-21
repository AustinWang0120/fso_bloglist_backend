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

test("able to convert _id to id", async () => {
  const res = await api.get("/api/blogs")
  const firstBlog = res.body[0]
  expect(firstBlog.id).toBeDefined()
  expect(firstBlog._id).not.toBeDefined()
  expect(firstBlog.__v).not.toBeDefined()
})

test("able to create a new blog", async () => {
  const newBlog = {
    title: "Forth blog",
    author: "Supertest",
    url: "https://supertest.com",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
  const titles = blogsAtEnd.map((blog) => (blog.title))
  expect(titles).toContain(newBlog.title)
})

test("default likes is 0", async () => {
  const newBlog = {
    title: "Forth blog",
    author: "Supertest",
    url: "https://supertest.com"
  }
  const res = await api.post("/api/blogs").send(newBlog)
  const resultBlog = await Blog.findById(res.body.id)
  expect(resultBlog.likes).toBe(0)
})

afterAll(async() => {
  await mongoose.connection.close()
})
