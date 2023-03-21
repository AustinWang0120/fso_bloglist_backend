const listHelper = require("../utils/list_helper")

test("dummy returns length", () => {
  const blogs = []
  expect(listHelper.dummy(blogs)).toBe(blogs.length)
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = []
    expect(listHelper.totalLikes(blogs)).toBe(0)
  })

  test("when list has only one blog equals the likes of that", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      }
    ]
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test("of a bigger list is calculated right", () => {
    expect(listHelper.totalLikes(listHelper.exampleBlogs)).toBe(36)
  })
})

describe("some advanced tests", () => {
  test("the most liked blog", () => {
    expect(listHelper.favoriteBlog(listHelper.exampleBlogs)).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })

  test("who has most blogs", () => {
    expect(listHelper.mostBlogs(listHelper.exampleBlogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test("who has most likes", () => {
    expect(listHelper.mostLikes(listHelper.exampleBlogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
