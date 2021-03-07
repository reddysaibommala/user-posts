const express = require("express");
const router = express.Router();
const { Post } = require('./../../models/post');
const { Like } = require('./../../models/like');
const { validateRecord } = require('./../posts/middlewares');
const { checkIfAuthenticated } = require('./../../lib/authenticate');

router.post(
  '/:id',
  checkIfAuthenticated,
  validateRecord,
  function(req, res, next) {
  let { record } = res.locals|| {};
  let query = {
    uid: req.authId,
    postId: record._id
  }
  Like.findOne(query)
  .then((response) => {
    if (response && Object.keys(response).length) {
      Post.updateOne({
        _id: record._id
      },{
        $set: {
          points: record.points - 1
        }
      })
      .then(() => {
        return Like.deleteOne(query);
      })
      .then(() => {
        res.status(200).send({message: 'Post unliked successfully'});
      })
      .catch(err => {
        err.status = 400;
        next(err);
      })
    } else {
      Post.updateOne({
        _id: record._id
      },{
        $set: {
          points: record.points + 1
        }
      })
      .then(() => {
        return Like.create(query);
      })
      .then(() => {
        res.status(200).send({message: 'Post liked successfully'});
      })
      .catch(err => {
        err.status = 400;
        next(err);
      })
    }
  })
  .catch(err => {
    res.status(400).send({ error: err.message });
  });
})

module.exports = router;