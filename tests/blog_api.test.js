const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")

const login = async (username, password) => {
  const res = await api
    .post("/api/login")
    .send({
      username, password
    })
    .expect(200)
  return res.body.token
}

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
  // create a super user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash("password", 10)
  const user = new User({ username: "root", name: "Superuser", passwordHash })
  await user.save()
  const savedUser = await User.findOne({ username: "root" })
  
  const userId = savedUser._id
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    const newBlog = { ...blog, user: userId }
    const blogObject = new Blog(newBlog)
    const savedBlog = await blogObject.save()
    savedUser.blogs = savedUser.blogs.concat(mongoose.Types.ObjectId(savedBlog.id))
  }
  await savedUser.save()
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
  const token = await login("root", "password")
  const newBlog = {
    title: "Forth blog",
    author: "Supertest",
    url: "https://supertest.com",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
  const titles = blogsAtEnd.map((blog) => (blog.title))
  expect(titles).toContain(newBlog.title)
})

test("default likes is 0", async () => {
  const token = await login("root", "password")
  const newBlog = {
    title: "Forth blog",
    author: "Supertest",
    url: "https://supertest.com"
  }
  const res = await api.post("/api/blogs").set("Authorization", `Bearer ${token}`).send(newBlog)
  const resultBlog = await Blog.findById(res.body.id)
  expect(resultBlog.likes).toBe(0)
})

test("blog without title or url cannot be added", async () => {
  const token = await login("root", "password")
  const blogWithoutTitle = {
    author: "Supertest",
    url: "https://supertest.com",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogWithoutTitle)
    .expect(400)
  
  const blogWithoutUrl = {
    title: "Fifth blog",
    author: "Supertest",
    likes: 100
  }
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogWithoutUrl)
    .expect(400)
})

test("able to delete a blog", async () => {
  const token = await login("root", "password")
  const blogsAtStart = await Blog.find({})
  const firstBlogId = blogsAtStart[0]._id.toString()
  await api
    .delete(`/api/blogs/${firstBlogId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204)
  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
  const invalidBlog = await Blog.findById(firstBlogId)
  expect(invalidBlog).toBeNull()
})

test("able to update a blog", async () => {
  const token = await login("root", "password")
  const blogsAtStart = await Blog.find({})
  const firstBlog = blogsAtStart[0]
  const newBlog = {
    title: "New Blog",
    author: "Austin Wang",
    url: "https://404.com",
    likes: 0
  }
  await api
    .put(`/api/blogs/${firstBlog._id.toString()}`)
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
  const blogsAtEnd = await Blog.find({})
  const titles = blogsAtEnd.map((blog) => (blog.title))
  expect(titles).toContain(newBlog.title)
  expect(titles).not.toContain(firstBlog.title)
})

afterAll(async() => {
  await mongoose.connection.close()
})
