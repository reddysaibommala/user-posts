const Validator = require('validatorjs');
const ObjectId = require('mongoose').Types.ObjectId;

Validator.register(
  'mongo_object_id',
  function (value, requirement, attribute) {
    return value && isValidObjectId(value) && ObjectId.isValid(value);
  },
  ':attribute should be a valid mongo objectId.'
);

Validator.register(
  'email',
  function (value, requirement, attribute) {
    return /\S+@\S+/.test(value);
  },
  ':attribute should be valid format'
);

const validator = (data, rules, customMessages, customAttributeNames, callback) => {
  const validation = new Validator(data, rules, Object.assign({
    array: ":attribute must be a array.",
    accepted: ':attribute must be accepted.',
    after: ':attribute must be after :after.',
    after_or_equal: ':attribute must be equal or after :after_or_equal.',
    alpha: ':attribute field must contain only alphabetic characters.',
    alpha_dash: ':attribute field must contain only alpha-numeric characters, as well as dashes and underscores.',
    alpha_num: ':attribute field must be alphanumeric.',
    before: ':attribute must be before :before.',
    before_or_equal: ':attribute must be equal or before :before_or_equal.',
    between: {
      numeric: ':attribute field must be between :min and :max.',
      string: ':attribute field must be between :min and :max characters.',
    },
    confirmed: ':attribute confirmation does not match.',
    email: ':attribute format is invalid.',
    def: ':attribute attribute has errors.',
    digits: ':attribute must be :digits digits.',
    digits_between: ':attribute field must be between :min and :max digits.',
    different: ':attribute and :different must be different.',
    in: 'Selected :attribute is invalid.',
    integer: ':attribute must be an integer.',
    hex: ':attribute field should have hexadecimal format',
    min: {
      numeric: ':attribute must be at least :min.',
      string: ':attribute must be at least :min characters.'
    },
    max: {
      numeric: ':attribute should not be greater than :max.',
      string: ':attribute should not be greater than :max characters.'
    },
    not_in: 'Selected :attribute is invalid.',
    numeric: ':attribute must be a number.',
    present: ':attribute field must be present (but can be empty).',
    required: ':attribute field is required.',
    required_if: ':attribute field is required when :other is :value.',
    required_unless: ':attribute field is required when :other is not :value.',
    required_with: ':attribute field is required when :field is not empty.',
    required_with_all: ':attribute field is required when :fields are not empty.',
    required_without: ':attribute field is required when :field is empty.',
    required_without_all: ':attribute field is required when :fields are empty.',
    same: ':attribute and :same fields must match.',
    size: {
      numeric: ':attribute must be :size.',
      string: ':attribute must be :size characters.'
    },
    string: ':attribute must be a string.',
    url: ':attribute format is invalid.',
    regex: ':attribute format is invalid.',
    attributes: {}
  }, customMessages));
  validation.setAttributeNames(customAttributeNames);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const isValidObjectId = function(str) {
  if (typeof str !== 'string') {
    return false;
  }
  return str.match(/^[a-f\d]{24}$/i);
};

module.exports = validator;