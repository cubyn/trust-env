const { EntryNotFoundError } = require('./errors');

const COMPOSED_TYPES = [
  'stringsArray',
  'integersArray',
  'numbersArray',
];

const findEntry = (contract, key) => {
  // Entry unicity is already checked
  const entry = contract.find(item => item.key === key);

  if (entry.length === 0) {
    throw new EntryNotFoundError(contract, key);
  }

  return entry;
};

// Internally renames "default" into "defaultValue":
// ("default" property is annoying to works with)
const sanitizeEntry = (entry) => {
  const result = {
    key: entry.key,
    type: entry.type,
  };

  if (entry.default) {
    result.defaultValue = entry.default;
  }

  if (entry.validator) {
    result.validator = entry.validator;
  }

  if (entry.transform) {
    result.transform = entry.transform;
  }

  return result;
};

const transformComposedType = (type, value) => {
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
    default:
      throw new Error();
  }
};

/**
 * No validations are supposed to be done
 */
const extractEnvVariables = contract => contract.reduce((acc, { key }) => {
  const { type, defaultValue, transform } = findEntry(contract, key);
  let value = process.env[key] || defaultValue;

  if (COMPOSED_TYPES.includes(type)) {
    value = transformComposedType(type, value);
  }

  acc[key] = transform
    ? transform(value)
    : value;

  return acc;
}, {});

module.exports = {
  sanitizeEntry,
  extractEnvVariables,
};
