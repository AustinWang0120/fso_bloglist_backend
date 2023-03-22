const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

describe("create a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash("password", 10)
    const rootUser = new User({
      username: "root",
      name: "Superuser",
      passwordHash: passwordHash
    })
    await rootUser.save()
  })

  test("a valid user can be added", async () => {
    const usersAtStart = await User.find({})
    const user = {
      username: "yyaustin",
      name: "Noledge",
      password: "password"
    }
    await api.post("/api/users").send(user).expect(201).expect("Content-Type", /application\/json/)
    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map((user) => (user.username))
    expect(usernames).toContain(user.username)
  })

  test("an invalid user cannot be added", async () => {
    const usersAtStart = await User.find({})
    const invalidUsers = [
      { password: "test" },
      { username: "test" },
      { username: "1", password: "test" },
      { username: "test", password: "1" }
    ]
    for (let user of invalidUsers) {
      const res = await api.post("/api/users").send(user)
      expect(res.status).toEqual(expect.any(Number))
      expect([400, 401, 500]).toContain(res.status)
    }
    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
