const isJs = require('is_js');
const {
  DefaultInvalidTypeError,
  DuplicateEntriesError,
  ContractNotFoundError,
  EntryNotFoundError,
} = require('./errors');

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

const assertEntriesValidation = (contract) => {
  const declarationsValidations = contract.map((declaration) => {
    const defaultRightType = isJs[declaration.type](declaration.defaultValue);

    if (declaration.defaultValue && !defaultRightType) {
      throw new DefaultInvalidTypeError(declaration.defaultValue, declaration.type);
    }

    if (declaration.validator) {
      const isValid = declaration.validator(declaration);

      if (!isValid) {
        throw new Error();
      }
    }

    return true;
  });

  const allValid = declarationsValidations.every(validation => validation === true);

  if (!allValid) {
    throw new Error();
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
  assertContractExists,
  // assertDeclarationValid,
  assertEntriesValidation,
  assertNoDuplicatesEntries,
  findDeclaration,
  sanitizeDeclaration,
  validateValueType,
};
