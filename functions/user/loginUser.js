const express = require("express");
const router = express.Router();
const firebase = require('firebase');

const validator = require('./../../lib/validate');
const utils = require('./../../lib/utils');

const formatRules = (req, res, next) => {
  res.locals.rules = {
    "email": "required|email",
    "password": "required|string"
  }

  next();
}

const validateRequest = (req, res, next) => {
  let { body: data } = req || {};
  let { rules = {}, customMessage = {}, customAttributeNames = {} } = res.locals || {};

  validator(data, rules, customMessage, customAttributeNames, (err, status) => {
    if (!status) {
      if(err && err.errors) {
        let errorMessage = new Error(err.errors[Object.keys(err.errors)[0]][0]);
        errorMessage = utils.formatMessage(errorMessage, err, customAttributeNames);
        errorMessage.status = 400;
        next(errorMessage);
      } else {
        next(err);  
      }
    } else {
      res.locals.validatedData = data;
      next();
    }
  });
}

const formatData = (req, res, next) => {
  let { validatedData } = res.locals || {};
  let {
    email = undefined,
    password = undefined
  } = validatedData || {};

  res.locals.data = {
    email,
    password
  };
  next();
}

router.post(
  '/',
  formatRules,
  validateRequest,
  formatData,
  async function(req, res, next) {
    let { data = {} } = res.locals|| {};
    firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    .then((userCredential) => {
      // Signed in
      return res.send(userCredential.user);
    })
    .catch((error) => {
      next(error)
    });
  }
);

module.exports = router;