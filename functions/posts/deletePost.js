const express = require("express");
const router = express.Router();
const upload = require('./../../lib/upload');
const { Post } = require('./../../models/post');
const { Like } = require('./../../models/like');
const { validateRecord } = require('./middlewares');
const { checkIfAuthenticated } = require('./../../lib/authenticate');

router.delete(
  '/:id',
  checkIfAuthenticated,
  validateRecord,
  function(req, res, next) {
    let { record } = res.locals || {};
    if ( record &&
      record.attachment &&
      record.attachment.key) {
      upload.removeFile(req, res, record.attachment.key, function(err, result) {
        if (err) next(err);
        else next();
      })
    } else next();
  },
  function(req, res, next) {
    let { query, record } = res.locals|| {};
    Post.deleteOne(query)
    .then(async (response) => {
      await Like.deleteMany({ postId: record._id});
      res.status(200).send({message: 'Post deleted successfully'});
    })
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
  }
)

module.exports = router;