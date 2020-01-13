const isJs = require('is_js');
const {
  DefaultInvalidTypeError,
  DuplicateEntriesError,
  ContractNotFoundError,
  EntryNotFoundError,
} = require('./errors');

const validateDefaultType = ({ type, defaultValue }) => isJs[type](defaultValue);

const validateValueType = ({ type, key }) => isJs[type](process.env[key]);

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

const assertContractExists = (contract) => {
  if (!contract || !contract.length) {
    throw new ContractNotFoundError();
  }
};

const assertNoDuplicatesEntries = (contract) => {
  const duplicates = contract
    .map(({ key }) => key)
    .reduce((acc, element, i, arr) => {
      if (arr.indexOf(element) !== i && acc.includes(element)) {
        acc.push(element);
      }

      return acc;
    }, []);

  if (duplicates.length) {
    throw new DuplicateEntriesError(contract, duplicates);
  }
};

const assertDeclarationValid = (declaration) => {
  const defaultRightType = validateDefaultType(declaration);

  if (declaration.defaultValue && !defaultRightType) {
    throw new DefaultInvalidTypeError(declaration.defaultValue, declaration.type);
  }
};

// "default" keyword is annoying to works with
// Internally renames in "defaultValue"
const sanitizeDeclaration = declaration => ({
  key: declaration.key,
  type: declaration.type,
  validator: declaration.validator,
  transform: declaration.transform,
  defaultValue: declaration.default,
});

module.exports = {
  validateDefaultType,
  validateValueType,
  findDeclaration,
  assertNoDuplicatesEntries,
  assertDeclarationValid,
  sanitizeDeclaration,
  assertContractExists,
};
