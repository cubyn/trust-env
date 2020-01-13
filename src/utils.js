const isJs = require('is_js');
const {
  DefaultInvalidTypeError,
  DuplicateEntriesError,
  EntryNotFoundError,
} = require('./errors');

const validateDefaultType = ({ type, defaultValue }) => isJs[type](defaultValue);

const validateValueType = ({ type, variable }) => isJs[type](process.env[variable]);

const findDeclaration = (contract, variable) => {
  const declarations = contract.filter(declaration => declaration.variable === variable);

  // Should not occurs (already validated in #config)
  if (declarations.length > 1) {
    throw new DuplicateEntriesError(contract, [variable]);
  } else if (declarations.length === 0) {
    throw new EntryNotFoundError(contract, variable);
  }

  return declarations[0];
};

const assertNoDuplicatesEntries = (contract) => {
  const duplicates = contract
    .map(({ variable }) => variable)
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
  variable: declaration.variable,
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
};
