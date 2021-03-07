const express = require("express");
const router = express.Router();
const { Post } = require('./../../models/post');
const upload = require('./../../lib/upload');
const { checkIfAuthenticated } = require('./../../lib/authenticate');
const { formatRules, validateRequest, formatData, uniqueValidation } = require('./middlewares');

router.post(
  '/',
  checkIfAuthenticated,
  function(req, res, next) {
    upload.uploadFile(req, res, 'attachment', function(err, result){
      if (err) {
        return res.status(422).send(err);
      } else {
        req.body.attachment = result;
        next()
      }
    })
  },
  formatRules,
  validateRequest,
  formatData,
  uniqueValidation,
  function(req, res, next) {
    let { data } = res.locals|| {};
    Post.create(data)
    .then((response) => {
      res.status(200).send({message: 'Post created successfully', id: response.id});
    })
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
  }
)

module.exports = router;