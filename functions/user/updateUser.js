const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');
const { formatRules, validateRequest, formatData } = require('./middlewares');

router.patch(
  '/',
  formatRules,
  validateRequest,
  formatData,
  async function(req, res, next) {
    let { data } = res.locals|| {};
    admin.auth().updateUser(req.authId, utils.omitUndefined(data))
    .then((user) => {
      res.status(200).send({ message: 'User updated successfully'});
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
  }
);

module.exports = router;