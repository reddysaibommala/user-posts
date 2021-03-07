const express = require("express");
const router = express.Router();
const admin = require('firebase-admin');

router.delete(
  '/',
  async function(req, res, next) {
    admin.auth().deleteUser(req.authId)
    .then((user) => {
      res.status(200).send({message: 'User deleted successfully'});
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
  }
);

module.exports = router;
