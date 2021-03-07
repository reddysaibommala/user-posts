const validator = require('./../../lib/validate');
const utils = require('./../../lib/utils');

const formatRules = (req, res, next) => {
  res.locals.rules = {
    "displayName": "required|string",
    "email": "required|email",
    "password": "required|string"
  }

  if(req.method.toLowerCase() === 'patch') {
    Object.keys(res.locals.rules).forEach(x => { 
      if(x.indexOf("*") === -1 && res.locals.rules[x].indexOf("required") !== -1) {
        res.locals.rules[x] = "sometimes|" + res.locals.rules[x];
      } 
    })
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
    displayName = undefined,
    email = undefined,
    password = undefined
  } = validatedData || {};

  res.locals.data = {
    displayName,
    email,
    password
  };
  next();
}

module.exports = {
  formatRules,
  validateRequest,
  formatData
}