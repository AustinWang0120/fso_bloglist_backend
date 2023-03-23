const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "incorrect username or password"
    })
  }

  // generate the token based on username and id
  const forToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(forToken, process.env.SECRET, { expiresIn: 60*60 })
  res.status(200).json({
    token: token,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter
