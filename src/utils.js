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

// "default" keyword is annoying to works with
// Internally renames in "defaultValue"
const sanitizeDeclaration = declaration => ({
  key: declaration.key,
  type: declaration.type,
  defaultValue: declaration.default,
  validator: declaration.validator,
  transform: declaration.transform,
});

module.exports = {
  findDeclaration,
  sanitizeDeclaration,
};
