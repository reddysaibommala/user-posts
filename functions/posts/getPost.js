const express = require("express");
const router = express.Router();
const { validateRecord } = require('./middlewares');

router.get(
  '/:id',
  validateRecord,
  function(req, res, next) {
    let { record } = res.locals || {};
    res.status(200).send(record);
  }
);

module.exports = router;