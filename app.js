const config = require("./utils/config")
const logger = require("./utils/logger")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")

// setup database connection
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

app.use("/api/blogs", blogsRouter)

app.use("/", (req, res) => {
  res.send("hello")
})

module.exports = app
