const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate({
    path: "blogs",
    select: "title author url likes"
  })
  res.send(users)
})

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body

  if (password.length < 3) {
    return res.status(400).json({
      error: "password must be at least 3 characters"
    })
  }
  const saltsRound = 10
  const passwordHash = await bcrypt.hash(password, saltsRound)

  const user = new User({
    username, name, passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
