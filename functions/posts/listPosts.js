const express = require("express");
const notes = require(".");
const router = express.Router();
const { Post } = require('./../../models/post');
const { validateRecord } = require('./middlewares');

const formatPagination = ({ query = {}}, res, next) => {
  let {
    perPage = 10, page = 1
  } = query;

  if (+page <= 0) {
    page = 1;
  }

  let skip = (page - 1) * perPage;

  res.locals.pagination = {
    limit: +perPage,
    skip: +skip,
    page: +page
  };

  next();
}

router.get(
  '/',
  formatPagination,
  async function(req, res, next) {
    let { query = {}, pagination} = res.locals|| {};
    let sort = {
      createdAt: -1,
      points: -1
    }
    let total = await Post.countDocuments(query);
    Post.find(query)
    .collation({locale: "en"})
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .then((result) => {
      res.status(200).send({
        posts: result,
        pagination: Object.assign(pagination, { total: total })
      });
    })
    .catch(next)
  }
);

module.exports = router;