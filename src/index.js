const isJs = require('is_js');
const {
  ContractNotFoundError,
  DefaultInvalidTypeError,
  DuplicateEntriesError,
  EntryNotFoundError,
  ResultNotFoundError,
} = require('./errors');

// TODO Give a type make it required?
//   No (e.g: type null or undefined)
// TODO transform()
// TODO Required is not compatible several types (e.g: null or undfined)

let contract = [];

const validateDefaultType = ({ type, defaultValue }) => isJs[type](defaultValue);

const validateValueType = ({ type, variable }) => isJs[type](process.env[variable]);

const findByVariable = (variable) => {
  const declarations = contract.filter(declaration => declaration.variable === variable);

  // Should not occurs (validated in #config)
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

const config = (contractParam) => {
  if (!contractParam || !contractParam.length) {
    throw new ContractNotFoundError();
  }

  // "default" keyword is annoying to works with
  // Internally renames in "defaultValue"
  contract = contractParam.map(({ variable, type, default: defaultValue, validate, transform }) => ({
    variable,
    type,
    validate,
    transform,
    defaultValue,
  }));

  assertNoDuplicatesEntries(contract);

  const declarationsValidations = contract.map((declaration) => {
    assertDeclarationValid(declaration);

    if (declaration.validate) {
      return declaration.validate(declaration);
    }

    return true;
  });

  const allValid = declarationsValidations.every(validation => validation === true);

  if (!allValid) {
    throw new Error();
  }
};

const get = (variable) => {
  if (!contract || !contract.length) {
    throw new ContractNotFoundError();
  }

  const { defaultValue, transform } = findByVariable(variable);

  // TODO validate by type or validate function if exists
  // if (!validateValueType(declaration)) {
  //   throw new Error();
  // }
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
