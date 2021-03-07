const { Post } = require('./../../models/post');
const validator = require('./../../lib/validate');
const utils = require('./../../lib/utils');
const mongoose = require('mongoose');

const formatRules = (req, res, next) => {
  res.locals.rules = {
    "title": "required|string",
    "description": "string",
    "attachment.url": "string",
    "attachment.label": "string",
    "attachment.key": "string",
  }

  // if(req.method.toLowerCase() === 'patch') {
  //   Object.keys(res.locals.rules).forEach(x => { 
  //     if(x.indexOf("*") === -1 && res.locals.rules[x].indexOf("required") !== -1) {
  //       res.locals.rules[x] = "sometimes|" + res.locals.rules[x];
  //     } 
  //   })
  // }
  
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
    title = undefined,
    description = undefined,
    attachment: {
      url = undefined,
      key = undefined,
      label = undefined
    } = {}
  } = validatedData || {};

  res.locals.data = {
    title,
    description,
    uid: req.authId,
    attachment: {
      url,
      key,
      label
    }
  };
  next();
}

const validateRecord = (req, res, next) => {
  let { id } = req.params || {};
  const validationRule = {
    "id": "required|mongo_object_id"
  };

  validator({
    id
  }, validationRule, {}, {} ,(err, status) => {
    if (!status) {
      if(err && err.errors) {
        let errorMessage = new Error(err.errors[Object.keys(err.errors)[0]][0]);
        errorMessage.status = 400;
        next(errorMessage);
      } else {
        next(err);  
      }
    } else {
      res.locals.query = { _id: mongoose.Types.ObjectId(id) };
      if(req.method.toLowerCase() === 'patch' || req.method.toLowerCase() === 'delete') {
        res.locals.query = Object.assign(res.locals.query, {
          uid: req.authId
        })
      }
      Post
        .findOne(res.locals.query)
        .then((result) => {
          res.locals.record = result;

          next();
        })
        .catch(next)
    }
  });
}

const uniqueValidation = (req, res, next) => { // validate uniqueness on entire collection
  let { id } = req.params || {};
  let { title } = res.locals.data || {};
  let query = {
    title: title
  }
  if (id) query = Object.assign(query, { _id: {$ne: mongoose.Types.ObjectId(id)}});
  Post
    .findOne(query)
    .then((result) => {
      res.locals.existingRecord = result;
      if (result) {
        let error =  new Error('Record is exists with the same title.')
        error.status = 400;
        throw error;
      }
      else next();
    })
    .catch(next)
}

module.exports = {
  formatRules,
  validateRequest,
  formatData,
  validateRecord,
  uniqueValidation
}