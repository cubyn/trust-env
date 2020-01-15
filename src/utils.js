const { DuplicateEntriesError, EntryNotFoundError } = require('./errors');

const findDeclaration = (contract, key) => {
  const declarations = contract.filter(declaration => declaration.key === key);

  // Should not occurs (already validated in #config)
  if (declarations.length > 1) {
    throw new DuplicateEntriesError(contract, [key]);
  } else if (declarations.length === 0) {
    throw new EntryNotFoundError(contract, key);
  }

  return declarations[0];
};

// Keep process.env variables to only works with safe values
const getDeclaredEnvVariables = contract => contract.reduce((acc, { key }) => {
  acc[key] = process.env[key];

  return acc;
}, {});

// "default" keyword is annoying to works with
// Internally renames in "defaultValue"
const sanitizeDeclaration = declaration => ({
  key: declaration.key,
  type: declaration.type,
  defaultValue: declaration.default,
  validator: declaration.validator,
  transform: declaration.transform,
});

const transformComposedType = (type, value) => {
  switch (type) {
    case 'integersArray':
      return value
        .split(',')
        .map(item => parseInt(item, 10));
    default:
      throw new Error();
  }
};

module.exports = {
  findDeclaration,
  getDeclaredEnvVariables,
  sanitizeDeclaration,
  transformComposedType,
};
