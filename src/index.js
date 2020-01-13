const { ResultNotFoundError } = require('./errors');
const {
  assertNoDuplicatesEntries,
  assertDeclarationValid,
  assertContractExists,
  findDeclaration,
  sanitizeDeclaration,
} = require('./utils');

// TODO transform as function
// TODO default as function
// TODO multi type
// TODO Give a type make it required? No (e.g: type null or undefined)
// TODO transform()
// TODO Required is not compatible several types (e.g: null or undfined)
// TODO get(['A', 'B'])
// TODO validate by type or validate function if exists

let contract = [];

const config = (contractParam) => {
  assertContractExists(contractParam);
  assertNoDuplicatesEntries(contractParam);

  contract = contractParam.map(sanitizeDeclaration);

  const declarationsValidations = contract.map((declaration) => {
    assertDeclarationValid(declaration);

    if (declaration.validator) {
      return declaration.validator(declaration);
    }

    return true;
  });

  const allValid = declarationsValidations.every(validation => validation === true);

  if (!allValid) {
    throw new Error();
  }
};

const get = (variable) => {
  assertContractExists(contract);

  const { defaultValue, transform } = findDeclaration(contract, variable);

  const envValue = process.env[variable];
  const result = envValue || defaultValue;

  if (result) {
    if (transform) {
      return transform(result);
    }

    return result;
  }

  throw new ResultNotFoundError(variable);
};

module.exports = {
  config,
  get,
};
