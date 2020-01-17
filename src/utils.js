const {
  EntryNotUniqueError,
  EntryNotFoundError,
  ResultNotFoundError,
} = require('./errors');

const COMPOSED_TYPES = [
  'stringsArray',
  'integersArray',
];

const findDeclaration = (contract, key) => {
  const declarations = contract.filter(declaration => declaration.key === key);

  // Should not occurs (already validated in #config)
  if (declarations.length > 1) {
    throw new EntryNotUniqueError(contract, [key]);
  } else if (declarations.length === 0) {
    throw new EntryNotFoundError(contract, key);
  }

  return declarations[0];
};

// Internally renames "default" into "defaultValue":
// ("default" property is annoying to works with)
const sanitizeEntry = (declaration) => {
  const result = {
    key: declaration.key,
    type: declaration.type,
  };

  if (declaration.default) {
    result.defaultValue = declaration.default;
  }

  if (declaration.validator) {
    result.validator = declaration.validator;
  }

  if (declaration.transform) {
    result.transform = declaration.transform;
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
    default:
      throw new Error();
  }
};

const extractEnvVariables = contract => contract
  .reduce((acc, { key }) => {
    const { type, defaultValue, transform } = findDeclaration(contract, key);
    let result = process.env[key] || defaultValue;

    if (!result) {
      throw new ResultNotFoundError(key);
    }

    if (COMPOSED_TYPES.includes(type)) {
      result = transformComposedType(type, result);
    }

    acc[key] = transform
      ? transform(result)
      : result;

    return acc;
  }, {});

module.exports = {
  sanitizeEntry,
  extractEnvVariables,
};
