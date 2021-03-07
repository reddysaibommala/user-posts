const express = require("express");
const router = express.Router();
const { validateRecord } = require('./middlewares');

router.get(
  '/:id',
  validateRecord,
  function(req, res, next) {
    let { record } = res.locals || {};
    if (record) res.status(200).send(record);
    else res.status(404).send(record);
  }
);

module.exports = router;