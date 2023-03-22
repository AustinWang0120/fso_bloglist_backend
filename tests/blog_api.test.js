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

test("blog without title or url cannot be added", async () => {
  const blogWithoutTitle = {
    author: "Supertest",
    url: "https://supertest.com",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .send(blogWithoutTitle)
    .expect(400)
  
  const blogWithoutUrl = {
    title: "Fifth blog",
    author: "Supertest",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .send(blogWithoutUrl)
    .expect(400)
})

test("able to delete a blog", async () => {
  const blogsAtStart = await Blog.find({})
  const firstBlogId = blogsAtStart[0]._id.toString()
  await api
    .delete(`/api/blogs/${firstBlogId}`)
    .expect(204)
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
  const invalidBlog = await Blog.findById(firstBlogId)
  expect(invalidBlog).toBeNull()
})

test("able to update a blog", async () => {
  const blogsAtStart = await Blog.find({})
  const firstBlog = blogsAtStart[0]
  const newBlog = {
    title: "New Blog",
    author: "Austin Wang",
    url: "https://404.com",
    likes: 0
  }
  await api.put(`/api/blogs/${firstBlog._id.toString()}`).send(newBlog).expect(200)
  const blogsAtEnd = await Blog.find({})
  const titles = blogsAtEnd.map((blog) => (blog.title))
  expect(titles).toContain(newBlog.title)
  expect(titles).not.toContain(firstBlog.title)
})

afterAll(async() => {
  await mongoose.connection.close()
})
