const listPosts = require('./listPosts');
const getPost = require('./getPost');
const createPost = require('./createPost');
const updatePost = require('./updatePost');
const deletePost = require('./deletePost');

module.exports = [
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
]