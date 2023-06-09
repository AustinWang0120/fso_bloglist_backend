const _ = require("lodash")

const exampleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikedBlog = blogs.reduce((prev, next) => (
    prev.likes > next.likes ? prev : next
  ))
  delete mostLikedBlog._id
  delete mostLikedBlog.__v
  delete mostLikedBlog.url
  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, "author")
  const authorCounts = _.mapValues(groupedByAuthor, (authorBlogs) => (authorBlogs.length))
  const mostBlogsAuthor = _.maxBy(_.keys(authorCounts), (author) => (authorCounts[author]))
  return {
    author: mostBlogsAuthor,
    blogs: authorCounts[mostBlogsAuthor]
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, "author")
  const authorLikes = _.mapValues(groupedByAuthor, (authorBlogs) => (_.sumBy(authorBlogs, "likes")))
  const mostLikesAuthor = _.maxBy(_.keys(authorLikes), (author) => (authorLikes[author]))
  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  }
}

module.exports = {
  exampleBlogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
