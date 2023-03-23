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

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    error: "unknown endpoint"
  })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({
      error: "malformatted id"
    })
  } else if (error.name === "ValidationError") {
    return res.status(400).send({
      error: error.message
    })
  } else {
    res.status(500).send({
      errorName: error.name,
      errorMessage: error.message
    })
  }
  next(error)
}

module.exports = {
  tokenExtractor, unknownEndpoint, errorHandler
}
/* eslint-disable no-unused-vars */
