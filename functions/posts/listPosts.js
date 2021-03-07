const express = require("express");
const notes = require(".");
const router = express.Router();
const { Post } = require('./../../models/post');
const { validateRecord } = require('./middlewares');

router.get(
  '/',
  function(req, res, next) {
    let { query = {}} = res.locals|| {};
    Post.find(query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next)
  }
);

module.exports = router;