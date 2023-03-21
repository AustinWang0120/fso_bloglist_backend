const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}