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
// ("default" keyword is annoying to works with)
const sanitizeEntry = declaration => ({
  key: declaration.key,
  type: declaration.type,
  defaultValue: declaration.default,
  validator: declaration.validator,
  transform: declaration.transform,
});

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

const processKey = (key, value, { contract }) => {
  const { type, defaultValue, transform } = findDeclaration(contract, key);
  let result = value || defaultValue;

  if (!result) {
    throw new ResultNotFoundError(key);
  }

  if (COMPOSED_TYPES.includes(type)) {
    result = transformComposedType(type, result);
  }

  return transform
    ? transform(result)
    : result;
};

const extractEnvVariables = contract => contract
  .reduce((acc, { key }) => {
    acc[key] = processKey(key, process.env[key], { contract });

    return acc;
  }, {});

module.exports = {
  sanitizeEntry,
  extractEnvVariables,
};
