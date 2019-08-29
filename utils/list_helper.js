/* eslint-disable linebreak-style */
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  return blogs.reduce(function(sum,blog){ return sum + blog.likes},0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(function (mostLikesBlog,blog){ return  blog.likes > mostLikesBlog.likes ? blog : mostLikesBlog },blogs[0] )
}

module.exports = {
  totalLikes,
  dummy,
  favoriteBlog
}