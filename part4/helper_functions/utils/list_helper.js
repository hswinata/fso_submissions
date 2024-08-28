const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sumLikes, blog) => {
    return sumLikes + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) =>
  blogs.reduce((prevBlog, blog) =>
    blog.likes > prevBlog.likes ? blog : prevBlog
  );

module.exports = { dummy, totalLikes, favoriteBlog };
