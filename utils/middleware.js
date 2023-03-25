const User = require("../models/user")
const jwt = require("jsonwebtoken")

/* eslint-disable no-unused-vars */
const tokenExtractor = (req, res, next) => {
  const authorization = req.headers.authorization
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (decodedToken.id) {
    const user = await User.findById(decodedToken.id)
    req.user = user
  } else {
    return res.status(401).json({
      error: "invalid token"
    })
  }
  next()
}

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    error: "unknown endpoint"
  })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({
      error: "malformatted id",
      stack: error.stack
    })
  } else if (error.name === "ValidationError") {
    return res.status(400).send({
      error: error.message,
      stack: error.stack
    })
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).send({
      error: "jwt token must be provided",
      stack: error.stack
    })
  } else {
    res.status(500).send({
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    })
  }
  next(error)
}

module.exports = {
  tokenExtractor, userExtractor, unknownEndpoint, errorHandler
}
/* eslint-disable no-unused-vars */
