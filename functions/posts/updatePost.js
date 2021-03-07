const express = require("express");
const router = express.Router();
const upload = require('./../../lib/upload');
const { Post } = require('./../../models/post');
const { formatRules, validateRequest, formatData, validateRecord, uniqueValidation } = require('./middlewares');

router.patch(
  '/:id',
  validateRecord,
  function(req, res, next) {
    upload.uploadFile(req, res, 'attachment', function(err, result) {
      if (err) {
        return res.status(422).send(err);
      } else {
        req.body.attachment = result;
        next();
      }
    })
  },
  formatRules,
  validateRequest,
  formatData,
  uniqueValidation,
  function(req, res, next) {
    let { record, data } = res.locals || {};
    if (Object.keys(data.attachment).length &&
      record &&
      record.attachment &&
      record.attachment.key) {
      upload.removeFile(req, res, record.attachment.key, function(err, result) {
        if (err) next(err);
        else next();
      })
    } else next();
  },
  function(req, res, next) {
    let { data, query } = res.locals|| {};
    let { createdAt, ...other } = data;
    Post.updateOne(query, other)
    .then((response) => {
      res.status(200).send({message: 'Note updated successfully'});
    })
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
  }
)

module.exports = router;