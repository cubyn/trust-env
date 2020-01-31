const isJs = require('is_js');
const {
  EntryKeyNotFoundError,
  EntryTypeNotFoundError,
  EntryValidatorNotSucceededError,
} = require('./errors');

const sanitizeEntryKeys = entry => ({
  key: entry.key,
  type: entry.type,
  // Internally renames "default" into "defaultValue":
  // ("default" property is annoying to works with)
  defaultValue: entry.default,
  validator: entry.validator,
  transform: entry.transform,
});

const castToType = (type, value) => {
  switch (type) {
    case 'stringsArray':
      return value
        .split(',')
        .map(item => item.toString());
    case 'integersArray':
      return value
        .split(',')
        .map(item => parseInt(item, 10));
    case 'numbersArray':
      return value
        .split(',')
        .map(item => parseFloat(item));
    case 'string':
      return value.toString();
    case 'integer':
      return parseInt(value, 10);
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return Boolean(value);
    case 'date':
      return new Date(value);
    case 'json':
      return JSON.parse(value);
    default:
      throw new Error();
  }
};

const extractEnvVariables = contract => contract.reduce((acc, entry) => {
  const { key, type, defaultValue, transform, validator } = entry;

  if (isJs.falsy(key)) {
    throw new EntryKeyNotFoundError(entry);
  }

  if (isJs.falsy(type)) {
    throw new EntryTypeNotFoundError(entry);
  }

  let value = castToType(type, process.env[key] || defaultValue);

  if (transform) {
    value = transform({ value, entry, contract, isJs });
  }

  if (validator) {
    if (isJs.not.truthy(validator({ value, entry, contract, isJs }))) {
      throw new EntryValidatorNotSucceededError(entry);
    }
  }

  acc[key] = value;

  return acc;
}, {});

module.exports = {
  sanitizeEntryKeys,
  extractEnvVariables,
};
