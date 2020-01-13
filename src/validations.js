const isJs = require('is_js');
const {
  ContractNotFoundError,
  DefaultInvalidTypeError,
  DuplicateEntriesError,
} = require('./errors');

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

module.exports = {
  assertContractExists,
  assertEntriesValidation,
  assertNoDuplicatesEntries,
};
