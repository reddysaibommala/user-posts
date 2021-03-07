const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const { formatRules, validateRequest, formatData } = require('./middlewares');

router.post(
  '/',
  formatRules,
  validateRequest,
  formatData,
  async function(req, res, next) {
    let { data } = res.locals|| {};
    const user = await admin.auth().createUser(data);

    return res.send(user);
  }
);

module.exports = router;