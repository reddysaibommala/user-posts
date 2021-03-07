const lodash = require("lodash");

module.exports = {
  formatMessage: (msg, err, customAttributeNames = {}) => {
    if (msg && msg.message) {
      let field = Object.keys(err.errors)[0];
      msg.message = msg.message.replace(field, lodash.startCase(field));

      if(msg.message.indexOf(":attribute") !== -1) {
        if(customAttributeNames[field]) {
          msg.message = msg.message.replace(`:attribute`, customAttributeNames[field]);
        } else {
          msg.message = msg.message.replace(`:attribute`, field);
        }
      }
    }
    return msg;
  },
  isObject: (x) => {
    return typeof x === 'object' && x !== null
  },
  isArray: (x) => {
    return Array.isArray(x)
  },
  omitUndefined: function(data) {
    for (const [key, value] of Object.entries(data)) {
      if(this.isObject(value) && this.isArray(value)) {
        data[key] = value.map(y => this.omitUndefined(y));
      } else if(this.isObject(value)) {
        data[key] = this.omitUndefined(value)
        if(Object.keys(data[key]).length === 0) { delete data[key] }
      } else if(value === undefined) {
        delete data[key];
      }
    }

    return data;
  },
  resetEmptyString: function(data) {
    for (const [key, value] of Object.entries(data)) {
      if(this.isObject(value) && this.isArray(value)) {
        data[key] = value.map(y => this.resetEmptyString(y));
      } else if(isObject(value)) {
        data[key] = this.resetEmptyString(value)
        if(Object.keys(data[key]).length === 0) { delete data[key] }
      } else if(value === "") {
        data[key] = null
      }
    }

    return data;
  }
}