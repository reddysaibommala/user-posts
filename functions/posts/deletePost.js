const express = require("express");
const router = express.Router();
const upload = require('./../../lib/upload');
const { Post } = require('./../../models/post');
const { validateRecord } = require('./middlewares');

router.delete(
  '/:id',
  validateRecord,
  function(req, res, next) {
    let { record } = res.locals|| {};
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
    let { query } = res.locals|| {};
    Post.deleteOne(query)
    .then((response) => {
      res.status(200).send({message: 'Note deleted successfully'});
    })
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
  }
)

module.exports = router;