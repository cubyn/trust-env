const isJs = require('is_js');
const errors = require('./errors');

// TODO Give a type make it required?
//   No (e.g: type null or undefined)
// TODO transform()
// TODO Required is not compatible several types (e.g: null or undfined)

let contract = [];

const validateDefaultType = ({ type, defaultValue }) => isJs[type](defaultValue);

const validateValueType = ({ type, variable }) => isJs[type](process.env[variable]);

const findByVariable = (variable) => {
  const declarations = contract.filter(declaration => declaration.variable === variable);

  if (declarations.length > 1) {
    throw new errors.ContractDuplicateEntriesError(contract, declarations);
  } else if (declarations.length === 0) {
    throw new errors.ContractNotFoundEntryError(contract, variable);
  }

  return declarations[0];
};

const assertDeclarationValid = (declaration) => {
  const defaultRightType = validateDefaultType(declaration);

  // "default" is not the same type as the "type"
  if (declaration.defaultValue && !defaultRightType) {
    throw new errors.DeclarationDefaultNotRightTypeError(declaration.default, declaration.type);
  }
};

const config = (contractParam) => {
  // "default" keyword is annoying to works with
  // Internally renames in "defaultValue"
  contract = contractParam.map(({ variable, type, default: defaultValue, validate, transform }) => ({
    variable,
    type,
    validate,
    transform,
    defaultValue,
  }));

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

const getEnv = (variable) => {
  if (!contract || !contract.length) {
    throw new errors.ContractNotFoundError();
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

  throw new Error();
};

module.exports = {
  config,
  getEnv,
};
