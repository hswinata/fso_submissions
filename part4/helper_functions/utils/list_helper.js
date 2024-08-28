const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) =>
  blogs.reduce((sumLikes, blog) => sumLikes + blog.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((prevBlog, blog) =>
    blog.likes > prevBlog.likes ? blog : prevBlog
  );

const mostBlogs = (blogs) => {
  const authorBlogCount = _.countBy(blogs, "author");
  const authorWithMostBlog = _.maxBy(_.toPairs(authorBlogCount), 1);
  return { author: authorWithMostBlog[0], blogs: authorWithMostBlog[1] };
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, "author");
  const authorLikesCount = _.mapValues(blogsByAuthor, (blogs) => {
    return _.sumBy(blogs, "likes");
  });
  const authorWithMostLikes = _.maxBy(_.toPairs(authorLikesCount), 1);
  return { author: authorWithMostLikes[0], likes: authorWithMostLikes[1] };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
