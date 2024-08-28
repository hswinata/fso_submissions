const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sumLikes, blog) => {
    return sumLikes + blog.likes;
  }, 0);
};

module.exports = { dummy, totalLikes };
