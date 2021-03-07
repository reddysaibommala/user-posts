const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');

router.get(
  '/',
  async function(req, res, next) {
    admin.auth().getUser(req.authId)
    .then((user) => {
      res.status(200).send(user.toJSON());
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
  }
);

module.exports = router;
