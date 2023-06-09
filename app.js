const config = require("./utils/config")
const logger = require("./utils/logger")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const testingRouter = require("./controllers/testing")
const middleware = require("./utils/middleware")

// setup database connection
mongoose.set("strictQuery", false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("MongoDB connection successful")
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error)
  })

// setup routers and middlewares
app.use(cors())
app.use(express.json())
app.use(express.static("build"))
app.use(middleware.tokenExtractor)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
